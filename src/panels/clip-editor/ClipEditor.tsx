import { tryGetJSDrawable } from "../../app-state/FileHelpers";
import { useAppStore } from "../../app-state/StateManager";
import { NumberInput, StringInput } from "../Common";

function truncate(x: number, step: number) {
    return Math.floor(x / step) * step;
}


export function StringSetting(props: {
    val: string,
    setVal: (str: string) => void,
    settingName: string
}) {
    return <div>
        <label>{props.settingName}</label>
        <StringInput
            val={props.val}
            setVal={props.setVal}
        ></StringInput>
    </div>
}

export function NumberSetting(props: {
    val: number,
    setVal: (num: number) => void,
    settingName: string
}) {
    return <div>
        <label>{props.settingName}</label>
        <NumberInput
            val={props.val}
            setVal={props.setVal}
        ></NumberInput>
    </div>
}


export function ClipEditor() {
  const [currentlyEditingClip, setOnEditClip, editClip, files] =
    useAppStore(state => [state.currentlyEditingClip, state.setOnEditClip, state.editClip, state.state.files]);

  
  if (!currentlyEditingClip) return <p>No clip is currently open.</p>;
  const parsedFile = tryGetJSDrawable(files, currentlyEditingClip?.drawableID);
  if (!parsedFile) return <p>Failed to parse file.</p>
  

  return <div>
    <h1>Clip Editor</h1>
    <p>Start: {truncate(currentlyEditingClip.start, 0.01)}s</p>
    <p>End: {truncate(currentlyEditingClip.end, 0.01)}s</p>
    <div>
        {parsedFile.settings.map(setting => {
            let settingSetter = (newVal: any) => {
                editClip({
                    ...currentlyEditingClip,
                    settings: {
                        ...currentlyEditingClip.settings,
                        [setting.varName]: newVal
                    }
                });
            }

            switch (setting.type) {
                case "string":
                    return <StringSetting
                        key={setting.varName}
                        val={
                            (typeof currentlyEditingClip.settings[setting.varName] == "string") 
                            ? (currentlyEditingClip.settings[setting.varName] as string) : ""
                        }
                        setVal={settingSetter}
                        settingName={setting.varName}
                    ></StringSetting>;
                case "number":
                    return <NumberSetting
                        key={setting.varName}
                        val={
                            (typeof currentlyEditingClip.settings[setting.varName] == "number") 
                            ? (currentlyEditingClip.settings[setting.varName] as number) : 0
                        }
                        setVal={settingSetter}
                        settingName={setting.varName}
                    ></NumberSetting>
                default:
                    return <p>Unimplemented setting type.</p>
            }
        })}
    </div>
  </div>
}