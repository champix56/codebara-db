import { useEffect, useRef, useState } from "react";
//import {decode} from 'querystring'
import "./App.css";
import { theme } from "../db.json";
import { useSearchParams } from "react-router-dom";
import CanvasImageLayer from "./CanvasImageLayer.tsx";

function App() {
  const params = new URL(location.href).searchParams;
  if (null === params) return null;
  const images = [  ];
  const p = params.get("layers");
  const layers = JSON.parse(null !== p ? p : "");
  theme.parts
    .filter((e,ei) => {
      return e.type === "visual";
    })
    .forEach((element,index) => {
      element.assets.forEach(asset=>{
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
          id="codebara"
          images={images}
          onDrown={(b) => setbase64(b)}
        />
      </div>
      {/* <div id="code">{base64}</div> */}
    </div>
  );
}

export default App;
