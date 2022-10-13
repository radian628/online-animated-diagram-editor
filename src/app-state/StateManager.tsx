import create from "zustand";
import { RuntimeAppState, DrawFunction } from "./RuntimeState";
import { AppStateParser } from "./State";

export const useAppStore = create<RuntimeAppState>((set, get) => ({
  state: {
    rootDrawableID: "",
    files: {
      a: {
        name: "testfile",
        type: "text/plain",
        data: "Contents of testfile",
        tags: ["text"]
      },
      b: {
        name: "test file 2",
        type: "text/plain",
        data: "Contents of test file 2.",
        tags: ["text", "tag2"]
      },
      c: {
        name: "Text Component",
        type: "application/prs.diagram",
        data: JSON.stringify({
          type: "js",
          onUpdate: "ctx.fillText(textContent, width/2, height/2);",
          onFixedUpdate: "",
          fixedRefreshRate: 60,
          settings: [
            {
              type: "string",
              varName: "textContent"
            }
          ]
        }),
        tags: ["component"]
      },
    },
    tags: {}
  },
  functionCache: new Map(),
  load: (preSerializationState: string) => {
    try {
      let postSerializationState = JSON.parse(preSerializationState);
      let parsedAppState = AppStateParser.parse(postSerializationState);

      set({
        functionCache: new Map(),
        state: parsedAppState,
      }, true);

    } catch {
      window.alert("Failed to load project.");
    }
  },

  activeHelpBoxUUID: "",
  setActiveHelpBoxUUID: (uuid: string) => {
    set({ activeHelpBoxUUID: uuid });
  },

  helpBoxMessage: "",
  setHelpBoxMessage: message => {
    set({helpBoxMessage: message});
  },

  helpNotifierData: null,
  setHelpNotifierData: pos => {
    set({ helpNotifierData: pos });
  },

  setFile: (id, contents) => {
    let oldState = get();
    set({ state: { ...oldState.state, files: { ...oldState.state.files, [id]: {
      ...oldState.state.files[id], data: contents
    } } }})
  },

  activeCodeEditorUUID: "",
  setActiveCodeEditorUUID: (uuid: string) => {
    set({ activeCodeEditorUUID: uuid });
  },
  currentlyLoadedFileUUID: "",
  setCurrentlyLoadedFileUUID: (uuid: string) => {
    set({ currentlyLoadedFileUUID: uuid });
  },
}));