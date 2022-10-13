import { AppState } from "./State"

export type DrawFunctionArgs = {
  ctx: CanvasRenderingContext2D, // canvas context for drawing custom stuff
  width: number, // canvas width in pixels
  height: number, // canvas height in pixels

  time: number, // time relative to starting time for the instance of this draw function
  duration: number, // total duration of this draw function call
  gtime: number | undefined, // time relative to the enclosing timeline for the instance of this draw function

  draw: (path: string, opts: object) => void // draws some other thing with the given settings
}

export type DrawFunction = (...args: any[]) => void;

export type HelpNotifierData = { x: number, y: number, uuid: string, content: string | JSX.Element | JSX.Element[] }

export type RuntimeAppState = {
  functionCache: Map<string, DrawFunction>
  state: AppState,

  helpBoxMessage: string | JSX.Element | JSX.Element[],
  setHelpBoxMessage: ((message: string | JSX.Element | JSX.Element[]) => void) | null,

  activeHelpBoxUUID: string,
  setActiveHelpBoxUUID: (uuid: string) => void,

  load: (preSerializationState: string) => void

  helpNotifierData: HelpNotifierData | null
  setHelpNotifierData: (pos: HelpNotifierData | null) => void

  setFile: (filename: string, contents: string) => void

  activeCodeEditorUUID: string,
  setActiveCodeEditorUUID: (uuid: string) => void
  currentlyLoadedFileUUID: string,
  setCurrentlyLoadedFileUUID: (uuid: string) => void
}
