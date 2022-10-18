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
    <option value={SinglePanelType.FILE_EDITOR}>File Editor</option>
    <option value={SinglePanelType.FILE_EXPLORER}>File Viewer</option>
    <option value={SinglePanelType.DISPLAY}>Display</option>
    <option value={SinglePanelType.CLIP_EDITOR}>Clip Editor</option>
    <option value={SinglePanelType.EXPORT}>Export</option>
  </select>
}