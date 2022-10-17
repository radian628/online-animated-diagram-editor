import { CodeEditor } from "./panels/FileEditor"
import { Display } from "./panels/Display"
import { FileExplorer } from "./panels/FileExplorer"
import { Help } from "./panels/Help"
import { Undecided } from "./panels/Undecided"
import { ClipEditor } from "./panels/clip-editor/ClipEditor"

export enum SinglePanelType {
  UNDECIDED, 
  FILE_EDITOR,
  FILE_EXPLORER,
  TIMELINE,
  DISPLAY,
  HELP,
  CLIP_EDITOR
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
    case SinglePanelType.DISPLAY:
      return <Display></Display>
    case SinglePanelType.FILE_EDITOR:
      return <CodeEditor setIsActive={props.setIsActive} isActive={props.isActive}></CodeEditor>
    case SinglePanelType.FILE_EXPLORER:
      return <FileExplorer></FileExplorer>
    case SinglePanelType.HELP:
      return <Help setIsActive={props.setIsActive} isActive={props.isActive}></Help>
    case SinglePanelType.CLIP_EDITOR:
      return <ClipEditor></ClipEditor>
    default:
      return <p>Error: This panel type is unimplemented!</p>
  }
}