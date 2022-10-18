import React from "react";
import { useState } from "react";
import { useAppStore } from "../app-state/StateManager";
import { Helpable, StringInput } from "./Common";

import "./FileExplorer.css"

function zipper<A,B>(a: A[], b: (i: number) => B) {
  return a.map((e, i) => (i == a.length - 1) ? [e] : [e, b(i)]).flat(1);
}

const mimeTypeMap: Record<string, string> = {
  "text/plain": "Plaintext",
  "application/prs.diagram": "Diagram Component",
  "text/javascript": "JavaScript Source",
  "application/prs.timeline": "Timeline"
}

export function FileExplorer() {
  const [fileNameFilter, setFileNameFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  
  const [files, setCurrentlyLoadedFileUUID] = useAppStore(
    state => [state.state.files, state.setCurrentlyLoadedFileUUID]
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
      message={
        <React.Fragment>
          <p>Only show files which have all the tags listed here. Tags are used to categorize files instead of folders, so be sure to use them like folders.</p>,
          <ul>
            <li>Tags should be comma-separated</li>
            <li>Leading or trailing spaces in a tag name are ignored.</li>
          </ul>
        </React.Fragment>
      }
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
              return <tr
                onClick={(e => {
                  setCurrentlyLoadedFileUUID(id);
                })}
                className="file-explorer-file-info"
                key={id}
              >

                <td>{fileNameFilter
                  ? zipper(file.name.split(fileNameFilter), i => {
                    return <span key={i} className="highlighted">{fileNameFilter}</span>
                  })
                  : file.name
                }</td>
                
                <td>{mimeTypeMap[file.type] ?? `Unknown: ${file.type}`}</td>

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