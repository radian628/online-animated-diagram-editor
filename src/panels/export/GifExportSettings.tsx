import GIF from "gif.js";
import { useState } from "react";
import { NumberInput } from "../Common";

export function GifExportSettings() {
  const [framerate, setFramerate] = useState(30);

  return (
    <div>
      <div>
        <label>Framerate</label>
        <NumberInput val={framerate} setVal={setFramerate}></NumberInput>
      </div>
      <button onClick={() => {}}>Export</button>
    </div>
  );
}
