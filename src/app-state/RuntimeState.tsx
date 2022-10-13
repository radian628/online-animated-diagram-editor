import { AppState } from "./State"

export type DrawFunctionArgs = {
  ctx: CanvasRenderingContext2D, // canvas context for drawing custom stuff
  width: number, // canvas width in pixels
  height: number, // canvas height in pixels

  time: number, // time relative to starting time for the instance of this draw function
  duration: number, // total duration of this draw function call
  globalTime: number | undefined, // time relative to the enclosing timeline for the instance of this draw function

  draw: (path: string, opts: object) => void // draws some other thing with the given settings

  opts: object // custom settings for a drawable object
}

export type DrawFunction = (...args: any[]) => void;

export type RuntimeAppState = {
  functionCache: Map<string, DrawFunction>
  state: AppState,

  helpBoxMessage: string | JSX.Element | JSX.Element[],
  setHelpBoxMessage: ((message: string | JSX.Element | JSX.Element[]) => void) | null,

  activeHelpBoxUUID: string,
  setActiveHelpBoxUUID: (uuid: string) => void,

  load: (preSerializationState: string) => void

  helpNotifierPos: { x: number, y: number, uuid: string } | null
  setHelpNotifierPos: (pos: { x: number, y: number, uuid: string } | null) => void

}
