import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useAppStore } from '../app-state/StateManager';
import { DiagramComponentCodeEditor } from './file-editor-subtypes/DiagramComponentCodeEditor';
import { DefaultCodeEditor } from "./file-editor-subtypes/DefaultCodeEditor";
import { TimelineEditor } from './file-editor-subtypes/TimelineEditor';

export function CodeEditor(props: {
  isActive: boolean,
  setIsActive: (b: boolean) => void
}) {

  const [
    activeFileEditorUUID, setActiveFileEditorUUID, 
    currentlyLoadedFileUUID, setCurrentlyLoadedFileUUID,
    files
  ] = useAppStore(state => [
    state.activeFileEditorUUID, state.setActiveFileEditorUUID,
    state.currentlyLoadedFileUUID, state.setCurrentlyLoadedFileUUID,
    state.state.files
  ]);

  const [uuid] = useState(v4());

  const [isNew, setIsNew] = useState(true);
  useEffect(() => {
    if (isNew) {
      setIsNew(false);
      setActiveFileEditorUUID(uuid);
    }
  }, []);

  const [idOfFileBeingEdited, setIdOfFileBeingEdited] = useState<string>("");

  useEffect(() => {
    if (activeFileEditorUUID == uuid) {
      setIdOfFileBeingEdited(currentlyLoadedFileUUID);
    }
  }, [currentlyLoadedFileUUID]);
  
  useEffect(() => {
    if (activeFileEditorUUID == uuid) {
      props.setIsActive(true);
    } else {
      props.setIsActive(false);
    }
  }, [activeFileEditorUUID])

  let editor: JSX.Element = <p>Unable to open: Unknown file type.</p>;
  let file = files[idOfFileBeingEdited];
  if (file !== undefined) {
    switch (file.type) {
    case "application/prs.diagram":
      editor = <DiagramComponentCodeEditor
        uuid={idOfFileBeingEdited}
      ></DiagramComponentCodeEditor>
      break;
    case "application/prs.timeline":
      editor = <TimelineEditor uuid={idOfFileBeingEdited}></TimelineEditor>
      break;
    default:
      editor = <DefaultCodeEditor
      uuid={idOfFileBeingEdited}
      ></DefaultCodeEditor>
    }
  }

  return <div
    onClick={() => {
      setActiveFileEditorUUID(uuid);
    }}
  >
    {(idOfFileBeingEdited === "" ) 
    ? 
    <p>Open a file by clicking on it in the File Explorer panel.</p>
    :
    (editor as JSX.Element)}
  </div>
}