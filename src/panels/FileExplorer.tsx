import { useState } from "react";
import { useAppStore } from "../app-state/StateManager";
import { Helpable, StringInput } from "./Common";

function zipper<A,B>(a: A[], b: (i: number) => B) {
  return a.map((e, i) => (i == a.length - 1) ? [e] : [e, b(i)]).flat(1);
}

export function FileExplorer() {
  const [fileNameFilter, setFileNameFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  
  const [files] = useAppStore(
    state => [state.state.files]
  );

  const searchTags = tagsFilter
    .split(",")
    .map(s => s.replace(/^\s+|\s+$/g, "")) // no leading/trailing spaces
    .filter(s => s); // no empty tags

  return <div>
    <h2>Search</h2>

    <Helpable
      message="Only show files whose names contain the given text. Searching is case-sensitive."
    >
      <label>Name</label>
      <StringInput val={fileNameFilter} setVal={setFileNameFilter}></StringInput>
    </Helpable>
    
    <br></br>
    
    <Helpable
      message="Only show files which have all the tags listed here. Tags should be comma-separated. Leading or trailing spaces are ignored. This means that the tag '   text  ' is treated the same as the tag 'text'."
    >
      <label>Tags (comma-separated)</label>
      <StringInput val={tagsFilter} setVal={setTagsFilter}></StringInput>
    </Helpable>

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

            // name match
            .filter(([id, file]) => file.name.indexOf(fileNameFilter) != -1)

            // tags match
            .filter(([id, file]) => {
              for (let tag of searchTags) {
                if (file.tags.indexOf(tag) == -1) return false;
              }
              return true;
            })

            // formatting
            .map(([id, file]) => {
              return <tr key={id}>

                <td>{fileNameFilter
                  ? zipper(file.name.split(fileNameFilter), i => {
                    return <span key={i} className="highlighted">{fileNameFilter}</span>
                  })
                  : file.name
                }</td>
                
                <td>{file.type}</td>

                <td>{file.tags.map(tag => 
                  <span className={`file-tag${searchTags.indexOf(tag) == -1 ? "" : " highlighted"}`} key={tag}>{tag}</span>)
                }</td>

              </tr>
            })
        }
      </tbody>
    </table>
  </div>
}