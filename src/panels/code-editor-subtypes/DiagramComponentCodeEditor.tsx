import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useAppStore } from "../../app-state/StateManager";
import { JSDrawableParser } from "../../app-state/State";

export function DiagramComponentCodeEditor(props: {
    uuid: string
}) {
    const files = useAppStore(state => state.state.files);
    const file = files[props.uuid];

    const onChange = React.useCallback((value: string) => {
        console.log("value: ", value);
      }, []);

    if (!file) {
        return <p>Error: File does not exist.</p>
    }

    const maybeParsedFile = JSDrawableParser.safeParse(JSON.parse(file.data));
    if (!maybeParsedFile.success) {
        console.log(maybeParsedFile.error);
        return <p>Error: File claims to be a Diagram Component but is in the wrong format.</p>
    }
    const parsedFile = maybeParsedFile.data;

    return <div>
        <h1>Editing '{file.name}'</h1>
        <h2>Per-frame Update</h2>
        <CodeMirror
            value={parsedFile.onUpdate}
            extensions={[javascript()]}
            onChange={onChange}
        ></CodeMirror>
        <h2>Fixed Update</h2>
        <CodeMirror
            value={parsedFile.onFixedUpdate}
            extensions={[javascript()]}
            onChange={onChange}
        ></CodeMirror>
    </div>
}