import { DrawFunction, DrawFunctionArgs } from "../app-state/RuntimeState";
import { JSDrawable } from "../app-state/State";

type MathProps = keyof Math;

const builtinParams = [
  "ctx", // canvasrenderingcontext2d for drawing stuff to the canvas
  "width", // canvas width px
  "height", // canvas height px

  "time", // time relative to start of timeline element
  "duration", // total duration of timeline element
  "gtime", // global time relative to root timeline (possibly undefined)

  "draw", // function given a string and some other stuff that draws a drawable given a filename

  "sin", // trig function aliases
  "cos",
  "tan",
  "atan2",

  "length", // some useful vector functions
  "dot",
  "cross",
  "add", 
  "sub",
  "mul",
  "div",

  "lerp", // interpolation
  "smoothstep",
  "smootherstep"
] as const;
const nonFixedParams = [
  "interpfixed", // interpolates between a property of the "fixed" object
  "interpfixedlinear",  // interpolates between a property of the "fixed" object linearly
  "fixedprev", // previous "fixed" object
  "fixednext" // next "fixed" object
] as const;
const fixedParams = [
  "init", // pass in a callback (no params) to initialize fixedUpdate state. This callback is only called at the first frame
  "prev", // the previous/current fixedUpdate state.
  "next" // pass the next fixedUpdate state into this callback.
] as const;

export function createDrawFunction(drawable: JSDrawable): {
  update: Function,
  fixedUpdate: Function
} {
  const createFnWithDefaultParams = (extraParams: string[], src: string) => {
    return new Function(
      // builtin params
      ...builtinParams,
      // settings
      ...drawable.settings.map(s => s.varName),
      // any extra custom params
      ...extraParams, 
      // actual source code
      src
    );
  }


  return {
    update: createFnWithDefaultParams([...nonFixedParams], drawable.onUpdate),
    fixedUpdate: createFnWithDefaultParams([...fixedParams], drawable.onFixedUpdate),
  }
}