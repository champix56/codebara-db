import { useState } from "react";
//import {decode} from 'querystring'
import "./App.css";
import { theme } from "../db.json";
import CanvasImageLayer from "./CanvasImageLayer.tsx";

function App() {
  const params = new URL(location.href).searchParams;
  if (null === params) return null;
  const images:Array<string> = [  ];
  const p = params.get("layers");
  const layers = JSON.parse(null !== p ? p : "");
  theme.parts
    .filter((e) => {
      return e.type === "visual";
    })
    .forEach((element,index) => {
      element.assets.forEach((asset:any)=>{
       if( asset.id===layers[index])
        images.push(theme.startUrl+element.baseUrl+asset.url)
      })
  
    });
  const [base64, setbase64] = useState<string | undefined>(undefined);

  return (
    <div style={{ textAlign: "center" }}>
      hello
      <div id="img" className="hide">
        <CanvasImageLayer
          images={images}
          onDrawn={(b:string) => setbase64(b)}
        />
      </div>
      <div id="code">{base64}</div>
    </div>
  );
}

export default App;
