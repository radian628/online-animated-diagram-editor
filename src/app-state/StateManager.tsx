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
        data: "sdkfskdfhsdjkfh",
        tags: ["text"]
      },
      b: {
        name: "test file 2",
        type: "text/plain",
        data: "sdkfskdfhsdjkfh",
        tags: ["text", "tag2"]
      },
      c: {
        name: "Text Component",
        type: "application/prs.diagram",
        data: JSON.stringify({
          type: "js",
          onUpdate: "ctx.fillText('hello world', width/2, height/2);",
          onFixedUpdate: "",
          fixedRefreshRate: 60
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
  }
}));