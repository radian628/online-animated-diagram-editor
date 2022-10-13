import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from 
//@ts-ignore
"@codemirror/lang-javascript";
import { useAppStore } from "../../app-state/StateManager";
import { JSDrawable, JSDrawableParser } from "../../app-state/State";
import { StringInput } from "../Common";
import { IoClose } from "react-icons/io5";


// TODO: Validate that variable names are valid and non-duplicates
function SettingEditor(props: {
  setting: JSDrawable["settings"][number], 
  setSetting: (s: JSDrawable["settings"][number]) => void,
  deleteSetting: () => void
}) {
  return <div>
    <StringInput val={props.setting.varName} setVal={s => {
      props.setSetting({ ...props.setting, varName: s})
    }} ></StringInput>
    <select 
      value={props.setting.type}
      onChange={e => {
        props.setSetting({ ...props.setting, 
          type: e.currentTarget.value as JSDrawable["settings"][number]["type"] });
      }}
    >
      <option value="string">Text</option>
      <option value="number">Number</option>
    </select>
    <button
      onClick={e => props.deleteSetting()}
    ><IoClose></IoClose></button>
  </div>
}




function SettingsEditor(props: {
  settings: JSDrawable["settings"], 
  setSettings: (s: JSDrawable["settings"]) => void
}) {
  return <div>
    <button
      onClick={e => {
        props.setSettings([...props.settings, {
          type: "string",
          varName: "newSetting"
        }])
      }}
    >Add Setting</button>
    {props.settings.map((s ,i) => {
      return <SettingEditor
        setting={s}
        setSetting={s => {
          props.setSettings(props.settings.map((s2, j) => (j == i) ? s : s2));
        }}
        deleteSetting={() => {
          props.setSettings(props.settings.filter((s, j) => i != j));
        }}
      ></SettingEditor>
    })}
  </div>
}



export function DiagramComponentCodeEditor(props: {
    uuid: string
}) {
    const [files, setFile] = useAppStore(state => [state.state.files, state.setFile]);
    const file = files[props.uuid];

    const onPerFrameUpdateChange = React.useCallback((value: string) => {
      console.log("value: ", value);
      if (!parsedFile) return;
      setFile(props.uuid, JSON.stringify({ ...parsedFile, onUpdate: value }));
    }, [props.uuid, file]);
    const onFixedUpdateChange = React.useCallback((value: string) => {
        console.log("value: ", value);
        if (!parsedFile) return;
        setFile(props.uuid, JSON.stringify({ ...parsedFile, onFixedUpdate: value }));
      }, [props.uuid, file]);
      
    const [key, setKey] = useState(1);
    useEffect(() => {
      setKey(key + 1);
    }, [props.uuid]);

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
        <h2>Settings</h2>
        <SettingsEditor
          settings={parsedFile.settings}
          setSettings={s => {
            console.log(parsedFile);
            setFile(props.uuid, JSON.stringify({ ...parsedFile, settings: s }))
          }}
        ></SettingsEditor>
        <h2>Per-frame Update</h2>
        <CodeMirror
          key={key}
            value={parsedFile.onUpdate}
            extensions={[javascript()]}
            onChange={onPerFrameUpdateChange}
        ></CodeMirror>
        <h2>Fixed Update</h2>
        <CodeMirror
          key={-key}
            value={parsedFile.onFixedUpdate}
            extensions={[javascript()]}
            onChange={onFixedUpdateChange}
        ></CodeMirror>
    </div>
}