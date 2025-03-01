import { useState } from "react";
//import {decode} from 'querystring'
import "./App.css";
import { theme } from "../db.json";
import CanvasImageLayer from "./CanvasImageLayer";
const params = new URL(location.href).searchParams;
const name = params.get("name");
const health = params.get("health");
const attack = params.get("attack");
const id = params.get("id");
const images: Array<string> = [];
const p = params.get("layers");
let outH :number;
let outW :number
const gentype = params.get("type");
function App() {
  const [base64, setbase64] = useState<string | undefined>(undefined);

  let width = undefined;
  let height = undefined;
  //useEffect(() => {
  const layers = JSON.parse(null !== p ? p : "");
  if (!theme.deck.frontUrl.startsWith("http"))
    theme.deck.frontUrl = theme.startUrl + theme.deck.frontUrl;
  console.log(theme.deck);
  theme.parts
    .filter((e) => {
      return e.type === "visual";
    })
    .forEach((element, index) => {
      //@ts-ignore
      element.assets.forEach((asset: any) => {
        if (asset.id === (typeof layers[index]==="number"?layers[index]:layers[index].id))
          images.push(theme.startUrl + element.baseUrl + asset.url);
      });
    });
    const outHP = params.get("outh");
     const outWP = params.get("outw");
  if (gentype === "card") {
    width = theme.deck.width;
    height = theme.deck.height;
    outH=outHP!==null?parseInt(outHP):height
    outW=outWP!==null?parseInt(outWP):width
  } else {
    width = theme.assetsWidth;
    height = theme.assetsHeight;
    outH=outHP!==null?parseInt(outHP):256
    outW=outWP!==null?parseInt(outWP):256
  }
  //setmounted(true);
  //}, []);
  return (
    <div style={{ textAlign: "center" }}>
      <div id="img" className="hide">
        {/* :{mounted && ( */}
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
          layers={layers}
          theme={theme}
          outSize={{
            width:outW,
            height:outH
          }}
          id={id}
          onFirstDrawn={(b: string) => {
            setbase64(b);
            // @ts-ignore
            if (window.ReactNativeWebView) {
              // @ts-ignore
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ message: b })
              );
            } else console.log("generated");
          }}
        />
        {/* )} */}
      </div>
      {
        //@ts-ignore
        undefined !== window.ReactNativeWebView && <div id="code">{base64}</div>
      }
    </div>
  );
}

export default App;
