import { useState } from "react";
import { useAppStore } from "../app-state/StateManager";
import { StringInput } from "./Common";

function zipper<A,B>(a: A[], b: (i: number) => B) {
  return a.map((e, i) => (i == a.length - 1) ? [e] : [e, b(i)]).flat(1);
}

export function FileExplorer() {
  const [fileNameFilter, setFileNameFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  
  const [files] = useAppStore(
    state => [state.state.files]
  );

  const searchTags = tagsFilter.split(",").map(s => s.replace(/^\s|\s$/g, ""));

  return <div>
    <h2>Search</h2>

    <label>Name</label>
    <StringInput val={fileNameFilter} setVal={setFileNameFilter}></StringInput>
    
    <br></br>
    
    <label>Tags (comma-separated)</label>
    <StringInput val={tagsFilter} setVal={setTagsFilter}></StringInput>

    <h2>Files</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        {
          Object.entries(files)
            .filter(([id, file]) => file.name.match(fileNameFilter))
            .map(([id, file]) => {
              return <tr key={id}>

                <td>{fileNameFilter
                  ? zipper(file.name.split(fileNameFilter), i => {
                    return <span key={i} className="highlighted">{fileNameFilter}</span>
                  })
                  : file.name
                }</td>
                
                <td>{file.type}</td>

                <td>{file.tags.map(tag => <span key={tag}>{tag}</span>)}</td>

              </tr>
            })
        }
      </tbody>
    </table>
  </div>
}