import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { useAppStore } from "../../app-state/StateManager";

export function DefaultCodeEditor(props: {
    uuid: string
}) {
    const [files, setFile] = useAppStore(state => [state.state.files, state.setFile]);
    const file = files[props.uuid];

    const onChange = React.useCallback((value: string) => {
        console.log("value: ", value, "id: ", props.uuid);
        setFile(props.uuid, value);
      }, [props.uuid]);

    const [key, setKey] = useState(0);

    useEffect(() => {
      setKey(key + 1);
    }, [props.uuid]);

    if (!file) {
        return <p>Error: File does not exist.</p>
    }
    return <div>
        <h1>Editing '{file.name}'</h1>
        <CodeMirror
          key={key}
          value={file.data}
          onChange={onChange}
        ></CodeMirror>
    </div>
}