import { CodeEditor } from "./panels/CodeEditor"
import { FileExplorer } from "./panels/FileExplorer"
import { Help } from "./panels/Help"
import { Undecided } from "./panels/Undecided"

export enum SinglePanelType {
  UNDECIDED, 
  CODE_EDITOR,
  FILE_EXPLORER,
  TIMELINE,
  DISPLAY,
  HELP
}

export type SingleAppPanelState = {
  type: SinglePanelType
}

export function SingleAppPanel(props: {
  type: SinglePanelType,
  setIsActive: (b: boolean) => void,
  isActive: boolean
}) {
  switch (props.type) {
    case SinglePanelType.UNDECIDED:
      return <Undecided></Undecided>
    case SinglePanelType.CODE_EDITOR:
      return <CodeEditor></CodeEditor>
    case SinglePanelType.FILE_EXPLORER:
      return <FileExplorer></FileExplorer>
    case SinglePanelType.HELP:
      return <Help setIsActive={props.setIsActive} isActive={props.isActive}></Help>
    default:
      return <p>Error: This panel type is unimplemented!</p>
  }
}