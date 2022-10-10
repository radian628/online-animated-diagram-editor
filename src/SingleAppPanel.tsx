import { CodeEditor } from "./panels/CodeEditor"
import { FileExplorer } from "./panels/FileExplorer"
import { Undecided } from "./panels/Undecided"

export enum SinglePanelType {
  UNDECIDED, 
  CODE_EDITOR,
  FILE_EXPLORER,
  TIMELINE,
  DISPLAY,
  HELP,

}

export type SingleAppPanelState = {
  type: SinglePanelType
}

export function SingleAppPanel(props: {
  type: SinglePanelType
}) {
  switch (props.type) {
    case SinglePanelType.UNDECIDED:
      return <Undecided></Undecided>
    case SinglePanelType.CODE_EDITOR:
      return <CodeEditor></CodeEditor>
    case SinglePanelType.FILE_EXPLORER:
      return <FileExplorer></FileExplorer>
    default:
      return <p>Error: This panel type is unimplemented!</p>
  }
}