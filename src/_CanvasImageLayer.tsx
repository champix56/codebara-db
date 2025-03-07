import React, { useEffect, useRef } from "react";
import { IDeck } from "./models/theme";

interface CanvasImageLayerProps {
  images: string[];
  width?: number;
  height?: number;
  type: "card" | string;
  deck: IDeck;
  name: string;
  health: number;
  attack: number;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  onDrawn: Function;
}

const CanvasImageLayer: React.FC<CanvasImageLayerProps> = ({
  images,
  type = "card",
  width = 4096,
  height = 4096,
  deck,
  attack = 0,
  health = 0,
  onDrawn,
  name,
  id,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Effacer le canvas avant de redessiner
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (type === "card" && undefined !== deck) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Évite les problèmes CORS
      img.src = deck.frontUrl;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      //name
      ctx.beginPath();
      ctx.fillStyle = "black";
      let position = deck.positions.find((p) => p.type === "name");
      let posX = position?.x;
      //@ts-ignore
      let posY = position?.y + position?.height;
      ctx.font = "bold" + position?.height + "px arial";
      //@ts-ignore
      ctx.fillText(name, posX, posY);
      //health
      position = deck.positions.find((p) => p.type === "health");
      posX = position?.x;
      //@ts-ignore
      posY = position?.y + position?.height;
      ctx.font = "bold " + position?.height + "px arial";
      //@ts-ignore
      ctx.fillText(health.toString(), posX, posY);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      position = deck.positions.find((p) => p.type === "healthbar");
      //@ts-ignore
      posX = position?.x + (position?.width / 100) * health;
      //@ts-ignore
      posY = position?.y + position?.height;
      //@ts-ignore
      ctx.arc(posX, posY, position?.height, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "black";
      //attack
      position = deck.positions.find((p) => p.type === "attack");
      posX = position?.x;
      //@ts-ignore
      posY = position?.y + position?.height;
      ctx.font = "bold " + position?.height + "px arial";
      //@ts-ignore
      ctx.fillText(attack.toString(), posX, posY);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      position = deck.positions.find((p) => p.type === "attackbar");
      //@ts-ignore
      posX = position?.x + (position?.width / 100) * attack;
      //@ts-ignore
      posY = position?.y + position?.height;
      //@ts-ignore
      ctx.arc(posX, posY, position?.height, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "skyblue";
      position = deck.positions.find((p) => p.type === "id");
      posX = position?.x;
      //@ts-ignore
      posY = position?.y - position?.height;
      //@ts-ignore
      ctx.fillText(id, posX, posY);
      ctx.font = "bold " + position?.height + "px arial";
      ctx.fill();
      ctx.closePath();
    }

    const loadImages = async () => {
      const imageElements = await Promise.all(
        images.map((src) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Évite les problèmes CORS
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
          });
        })
      );

      let imgX = 0;
      let imgY = 0;
      let imgW = canvas.width;
      let imgH = canvas.height;
      // Dessiner chaque image chargée sur le canvas
      imageElements.forEach((img) => {
        if (type === "card" && undefined !== deck) {
          const imgposref = deck.positions.find((p) => p.type === "image");
          //@ts-ignore
          imgX = imgposref?.x + 50;
          //@ts-ignore
          imgY = imgposref?.y + 50;
          //@ts-ignore
          imgW = imgposref?.width - 100;
          //@ts-ignore
          imgH = imgposref?.height - 100;
        }
        ctx.drawImage(img, imgX, imgY, imgW, imgH);
      });
      // @ts-ignore
      if (window.ReactNativeWebView) {
        // @ts-ignore
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ message: canvas.toDataURL() })
        );
      }

      onDrawn(canvas.toDataURL());
    };

    loadImages();
  }, [images]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default CanvasImageLayer;
