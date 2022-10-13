
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useAppStore } from '../app-state/StateManager';
import { DiagramComponentCodeEditor } from './code-editor-subtypes/DiagramComponentCodeEditor';

export function CodeEditor(props: {
  isActive: boolean,
  setIsActive: (b: boolean) => void
}) {

  const [
    activeCodeEditorUUID, setActiveCodeEditorUUID, 
    currentlyLoadedFileUUID, setCurrentlyLoadedFileUUID,
    files
  ] = useAppStore(state => [
    state.activeCodeEditorUUID, state.setActiveCodeEditorUUID,
    state.currentlyLoadedFileUUID, state.setCurrentlyLoadedFileUUID,
    state.state.files
  ]);

  const [uuid] = useState(v4());

  const [idOfFileBeingEdited, setIdOfFileBeingEdited] = useState<string>("");

  useEffect(() => {
    if (activeCodeEditorUUID == uuid) {
      props.setIsActive(true);
      setIdOfFileBeingEdited(currentlyLoadedFileUUID);
    } else {
      props.setIsActive(false);
    }
  }, [activeCodeEditorUUID, currentlyLoadedFileUUID])

  let editor: JSX.Element = <p>Unable to open: Unknown file type.</p>;
  let file = files[idOfFileBeingEdited];
  console.log(file, idOfFileBeingEdited);
  if (file !== undefined) {
    switch (file.type) {
    case "application/prs.diagram":
      editor = <DiagramComponentCodeEditor
        uuid={idOfFileBeingEdited}
      ></DiagramComponentCodeEditor>
    }
  }

  return <div
    onClick={() => {
      setActiveCodeEditorUUID(uuid);
    }}
  >
    {(idOfFileBeingEdited === undefined ) 
    ? 
    <p>Open a file by clicking on it in the File Explorer panel.</p>
    :
    (editor as JSX.Element)}
  </div>
}