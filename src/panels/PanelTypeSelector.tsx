import { SinglePanelType } from "../SingleAppPanel";

export function PanelTypeSelector(props: {
  panelType: SinglePanelType,
  setPanelType: (t: SinglePanelType) => void
}) {
  return <select
    className="panel-type-selector"
    value={props.panelType}
    onChange={e => {
      props.setPanelType(Number(e.currentTarget.value));
    }}
  > 
    <option value={SinglePanelType.UNDECIDED}>None</option>
    <option value={SinglePanelType.HELP}>Help</option>
    <option value={SinglePanelType.CODE_EDITOR}>Code Editor</option>
    <option value={SinglePanelType.FILE_EXPLORER}>File Explorer</option>
  </select>
}