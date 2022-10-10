import { CodeEditor } from "./panels/CodeEditor"
import { Undecided } from "./panels/Undecided"

export enum SinglePanelType {
  UNDECIDED, CODE_EDITOR
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
  }
}