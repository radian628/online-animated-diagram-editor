import { useState } from "react";
import { useAppStore } from "../app-state/StateManager";
import { StringInput } from "./Common";

export function FileExplorer() {
  const [fileNameFilter, setFileNameFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState([""]);
  
  const [files] = useAppStore(
    state => [state.state.files]
  );

  return <div>
    <label>Name</label>
    <StringInput val={fileNameFilter} setVal={setFileNameFilter}></StringInput>
    <br></br>
    <label>Tags</label>
    <StringInput val={fileNameFilter} setVal={setFileNameFilter}></StringInput>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        {
          Object.entries(files)
            .filter(([id, file]) => file.name.match(fileNameFilter))
            .map(([id, file]) => {
              return <tr key={id}>
                <td>{file.name.split(fileNameFilter)}</td>
                <td>{file.tags.map(tag => <span key={tag}>{tag}</span>)}</td>
              </tr>
            })
        }
      </tbody>
    </table>
  </div>
}