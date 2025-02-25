import { useState } from "react";
//import {decode} from 'querystring'
import "./App.css";
import { theme } from "../db.json";
import CanvasImageLayer from "./CanvasImageLayer.tsx";

function App() {
  const [base64, setbase64] = useState<string | undefined>(undefined);
  const params = new URL(location.href).searchParams;
  if (null === params) {
    return null;
  }
  const name=params.get('name');
  const health=params.get('health');
  const attack=params.get('attack');
  const id=params.get('id');
  const images: Array<string> = [];
  const p = params.get("layers");
  const layers = JSON.parse(null !== p ? p : "");
  theme.deck.frontUrl=theme.startUrl+ theme.deck.frontUrl;
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
  const gentype = params.get("type");
  let width = undefined;
  let height = undefined;
  if (gentype === "card") {
    width = theme.deck.width;
    height = theme.deck.height;
  } else {
    width = theme.assetsWidth;
    height = theme.assetsHeight;
  }
  return (
    <div style={{ textAlign: "center" }}>
      hello
      <div id="img" className="hide">
        <CanvasImageLayer
          images={images}
          type={gentype?gentype:"card"}
          //@ts-ignore
          deck={theme.deck}
          name={name}
          attack={parseInt(attack?attack:"0")}
          health={parseInt(health?health:"0")}
          width={width}
          height={height}
          id={id}
          onDrawn={(b: string) => setbase64(b)}
        />
      </div>
      <div id="code">{base64}</div>
    </div>
  );
}

export default App;
