import { useEffect, useState } from "react";
//import {decode} from 'querystring'
import "./App.css";
import { theme } from "../db.json";
import CanvasImageLayer from "./CanvasImageLayer.tsx";

function App() {
  const [base64, setbase64] = useState<string | undefined>(undefined);
  const [mounted, setmounted] = useState(false);
  const params = new URL(location.href).searchParams;
  const name = params.get("name");
  const health = params.get("health");
  const attack = params.get("attack");
  const id = params.get("id");
  const images: Array<string> = [];
  const p = params.get("layers");
  const gentype = params.get("type");
  let width = undefined;
  let height = undefined;
  useEffect(() => {
    const layers = JSON.parse(null !== p ? p : "");
    if (!theme.deck.frontUrl.startsWith("http"))
      theme.deck.frontUrl = theme.startUrl + theme.deck.frontUrl;
    console.log(theme.deck);
    theme.parts
      .filter((e) => {
        return e.type === "visual";
      })
      .forEach((element, index) => {
        element.assets.forEach((asset: any) => {
          if (asset.id === layers[index])
            images.push(theme.startUrl + element.baseUrl + asset.url);
        });
      });

    if (gentype === "card") {
      width = theme.deck.width;
      height = theme.deck.height;
    } else {
      width = theme.assetsWidth;
      height = theme.assetsHeight;
    }
    setmounted(true);
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      hello
      <div id="img" className="hide">
        {mounted && (
          <CanvasImageLayer
            images={images}
            type={gentype ? gentype : "card"}
            //@ts-ignore
            deck={theme.deck}
            name={name}
            attack={parseInt(attack ? attack : "0")}
            health={parseInt(health ? health : "0")}
            width={width}
            height={height}
            id={id}
            onDrawn={(b: string) => setbase64(b)}
          />
        )}
      </div>
      <div id="code">{base64}</div>
    </div>
  );
}

export default App;
