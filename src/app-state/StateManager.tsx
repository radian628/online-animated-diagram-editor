import create from "zustand";
import { RuntimeAppState, DrawFunction } from "./RuntimeState";
import { AppState, AppStateParser } from "./State";
import { v4 as uuidv4 } from "uuid";
import { noUndefined } from "../panels/Common";

export function saveToLocalStorage(state: AppState) {
  localStorage.setItem("backup", JSON.stringify(state));
}

export function loadFromLocalStorage() {
  return localStorage.getItem("backup");
}



const defaultInitData = {
  saveStates: {},
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
        onUpdate: `ctx.font = fontSize + 'px ' + fontType;
ctx.fillStyle = fontColor;
ctx.fillText(textContent, x, y);`,
        onFixedUpdate: "",
        fixedRefreshRate: 60,
        settings: [
          {
            type: "string",
            varName: "textContent"
          },
          { type: "number", varName: "x" },
          { type: "number", varName: "y" },
          { type: "number", varName: "fontSize" },
          { type: "string", varName: "fontType" },
          { type: "string", varName: "fontColor" },
        ]
      }),
      tags: ["component"]
    },
    d: {
      name: "Timeline",
      type: "application/prs.timeline",
      data: JSON.stringify({
        type: "timeline",
        timeline: [
          {
            start: 0,
            end: 1,
            drawableID: "c",
            track: 0,
            settings: {},
            uuid: uuidv4()
          },
          {
            start: 4,
            end: 5,
            drawableID: "c",
            track: 0,
            settings: {},
            uuid: uuidv4()
          }
        ]
      }),
      tags: []
    }
  },
  tags: {}
};

function getInitData() {
  const initData = loadFromLocalStorage();
  if (!initData) {
    return defaultInitData;
  }
  try {
    const parsedInitData = AppStateParser.parse(JSON.parse(initData));
    return parsedInitData;
  } catch {
    return defaultInitData;
  }
}

export const useAppStore = create<RuntimeAppState>((set, get) => ({
  state: getInitData(),
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
    saveToLocalStorage(get().state);
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
    saveToLocalStorage(get().state);
  },

  activeFileEditorUUID: "",
  setActiveFileEditorUUID: (uuid: string) => {
    set({ activeFileEditorUUID: uuid });
  },
  currentlyLoadedFileUUID: "",
  setCurrentlyLoadedFileUUID: (uuid: string) => {
    set({ currentlyLoadedFileUUID: uuid });
  },

  currentTimelineTime: 0,
  setCurrentTimelineTime: (time: number) => {
    set({ currentTimelineTime: time })
  },
  currentDisplayTimelineUUID: "d",
  setCurrentDisplayTimelineUUID: (uuid: string) => {
    set({ currentDisplayTimelineUUID: uuid });
  },

  editClip: (newClip) => {
    get().onEditClip(newClip);
    set({
      currentlyEditingClip: newClip
    });
    saveToLocalStorage(get().state);
  },
  onEditClip: (newClip) => {},
  currentlyEditingClip: undefined,
  setOnEditClip: (clip, callback) => {
    set({
      onEditClip: callback,
      currentlyEditingClip: clip
    });
    saveToLocalStorage(get().state);
  },

  addSaveState: (name: string) => {
    set({
      state: {
        ...get().state,
        saveStates: {
          ...get().state.saveStates,
          [name]: noUndefined({ ...get().state, saveStates: undefined })
        }
      }
    });
    saveToLocalStorage(get().state);
  },
  loadSaveState: (name: string) => {
    const saveState = get().state.saveStates[name];
    if (!saveState) return;
    set({ state: { ...saveState, saveStates: get().state.saveStates } });
    saveToLocalStorage(get().state);
  },
  deleteSaveState: (name: string) => {
    set({
      state: { ...get().state, saveStates: noUndefined({
        ...get().state.saveStates, [name]: undefined
      }) }
    })
    saveToLocalStorage(get().state);
  },

  // createNewFile: (name, data, type) => {
  //   set({
  //     state: {
  //       ...get().state,
  //       files: {
  //         ...get().state.files,
  //         [uuidv4()]: {
  //           name, data, type, tags: []
  //         }
  //       }
  //     } 
  //   });
  // }

  isExporting: false,
  export: () => {
    set({ isExporting: true });
  }
}));