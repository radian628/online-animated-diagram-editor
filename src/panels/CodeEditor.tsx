import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useAppStore } from '../app-state/StateManager';
import { DiagramComponentCodeEditor } from './code-editor-subtypes/DiagramComponentCodeEditor';
import { DefaultCodeEditor } from "./code-editor-subtypes/DefaultCodeEditor";

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

  const [isNew, setIsNew] = useState(true);
  useEffect(() => {
    if (isNew) {
      setIsNew(false);
      setActiveCodeEditorUUID(uuid);
    }
  }, []);

  const [idOfFileBeingEdited, setIdOfFileBeingEdited] = useState<string>("");

  useEffect(() => {
    if (activeCodeEditorUUID == uuid) {
      setIdOfFileBeingEdited(currentlyLoadedFileUUID);
    }
  }, [currentlyLoadedFileUUID]);
  
  useEffect(() => {
    if (activeCodeEditorUUID == uuid) {
      props.setIsActive(true);
    } else {
      props.setIsActive(false);
    }
  }, [activeCodeEditorUUID])

  let editor: JSX.Element = <p>Unable to open: Unknown file type.</p>;
  let file = files[idOfFileBeingEdited];
  if (file !== undefined) {
    switch (file.type) {
    case "application/prs.diagram":
      editor = <DiagramComponentCodeEditor
        uuid={idOfFileBeingEdited}
      ></DiagramComponentCodeEditor>
      break;
    default:
      editor = <DefaultCodeEditor
      uuid={idOfFileBeingEdited}
      ></DefaultCodeEditor>
    }
  }

  return <div
    onClick={() => {
      setActiveCodeEditorUUID(uuid);
    }}
  >
    {(idOfFileBeingEdited === "" ) 
    ? 
    <p>Open a file by clicking on it in the File Explorer panel.</p>
    :
    (editor as JSX.Element)}
  </div>
}