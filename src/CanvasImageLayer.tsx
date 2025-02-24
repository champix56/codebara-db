import React, { useEffect, useRef } from "react";

interface CanvasImageLayerProps {
  images: string[];
  width?: number;
  height?: number;
  onDrown: Function;
  id: number;
}

const CanvasImageLayer: React.FC<CanvasImageLayerProps> = ({
  images,
  width = 4096,
  height = 4096,
  onDrown,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Effacer le canvas avant de redessiner
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      // Dessiner chaque image chargée sur le canvas
      imageElements.forEach((img) => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      });
      if(window.ReactNativeWebView) {     
        window.ReactNativeWebView.postMessage(JSON.stringify({message:canvas.toDataURL()}))
     }

      onDrown(canvas.toDataURL());
    };

    loadImages();
  }, [images]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default CanvasImageLayer;
