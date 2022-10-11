import create from "zustand";
import { RuntimeAppState, DrawFunction } from "./RuntimeState";
import { AppStateParser } from "./State";

export const useAppStore = create<RuntimeAppState>((set) => ({
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

  setHelpBoxMessage: null,
  setSetHelpBoxMessage: fn => {
    set({ setHelpBoxMessage: fn });
  },

  onActiveHelpBoxChange: () => {},
  setOnActiveHelpBoxChange: fn => {
    set({ onActiveHelpBoxChange: fn })
  }
}))