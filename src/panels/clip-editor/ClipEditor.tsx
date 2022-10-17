import { tryGetJSDrawable } from "../../app-state/FileHelpers";
import { useAppStore } from "../../app-state/StateManager";

export function ClipEditor() {
  const [currentlyEditingClip, setOnEditClip, editClip, files] =
    useAppStore(state => [state.currentlyEditingClip, state.setOnEditClip, state.editClip, state.state.files]);

  
  if (!currentlyEditingClip) return <p>No clip is currently open.</p>;
  const parsedFile = tryGetJSDrawable(files, currentlyEditingClip?.drawableID);
  if (!parsedFile) return <p>Failed to parse file.</p>
  

  return <div>
    <h1>Clip Editor</h1>
    <p>start {currentlyEditingClip.start} end {currentlyEditingClip.end}</p>
  </div>
}