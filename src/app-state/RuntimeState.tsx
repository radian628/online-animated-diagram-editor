import { ID } from "./State"

type DrawFunctionArgs = {
  ctx: CanvasRenderingContext2D, // canvas context for drawing custom stuff
  width: number, // canvas width in pixels
  height: number, // canvas height in pixels

  time: number, // time relative to starting time for the instance of this draw function
  duration: number, // total duration of this draw function call
  globalTime: number | undefined, // time relative to the enclosing timeline for the instance of this draw function

  draw: (path: string, opts: object) => void // draws some other thing with the given settings

  opts: object // custom settings for a drawable object
}

type DrawFunction = (...args: any[]) => void;

export type RuntimeAppState = {
  functionCache: Record<ID, DrawFunction>,
  getFunction: (id: ID) => DrawFunction
}