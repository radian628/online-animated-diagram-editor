import { AnySrvRecord } from "dns";
import { DrawFunction, DrawFunctionArgs } from "../app-state/RuntimeState";
import { JSDrawable } from "../app-state/State";

type Zeroed<T> = { [K in keyof T]: 0 };

type BuiltinParams = {
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  duration: number
}
const builtinParamsKeys = keyify<BuiltinParams>({ctx:0,width:0,height:0,time:0,duration:0});

type NonFixedAdditionalParams = {
  fixed: (f: (fixed: any) => number | undefined) => number,
  // fixedlerp: (f: (fixed: any) => number | undefined) => number,
  // fixedprev: any,
  // fixednext: any
};
const nonFixedAdditionalParamsKeys = keyify<NonFixedAdditionalParams>({
  fixed:0,
  //fixedlerp:0,fixedprev:0,fixednext:0
});

type FixedAdditionalParams = {
  prev: any,
  next: (next: any) => void
}
const fixedAdditionalParamsKeys = keyify<FixedAdditionalParams>({
  prev:0,next:0
});

const contextlessBuiltinFunctions = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  atan2: Math.atan2,
  length: (nums: number[]) => {
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
      sum += nums[i] * nums[i];
    }
    return Math.sqrt(sum);
  },
  dot: (a: number[], b: number[]) => {
    if (a.length != b.length) {
      throw new Error("Vectors must be the same size in a dot product!");
    }
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  },
  cross: (a: [number, number, number], b: [number, number, number]) => {
    if (a.length != 3 || b.length != 3) {
      throw new Error("Vectors must be three-dimensional for a cross product!");
    }
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  },

  // TODO:
  add: (a: number[] | number, b: number[] | number) => {
    if (!Array.isArray(a)) a = [a];

    if (Array.isArray(b)) {
      if (a.length != b.length) throw new Error("Vector addition requires vectors of the same length!");

    } else {

    }
  },
  sub: () => {},
  mul: () => {},
  div: () => {},

  lerp: (a: number, b: number, x: number) => (a + (b - a) * x),
  smoothstep: (a: number, b: number, x: number) =>
    x * x * (3 - 2 * x)
}

function keyify<T>(t: Zeroed<T>) {
  return Object.keys(t);
}

export function createDrawFunction(drawable: JSDrawable): {
  update: Function,
  fixedUpdate: Function
} {
  
  const createFnWithDefaultParams = <T extends string[]>(extraParams: T, src: string) => {
    const allParams: string[] = [
      // builtin params
      ...builtinParamsKeys,
      // any extra custom params
      ...extraParams, 
      // settings
      ...drawable.settings.map(s => s.varName)
    ]
    return new Function(`{${allParams.join(",")}}`,src);
  }


  return {
    update: createFnWithDefaultParams(nonFixedAdditionalParamsKeys, drawable.onUpdate),
    fixedUpdate: createFnWithDefaultParams(fixedAdditionalParamsKeys, drawable.onFixedUpdate),
  }
}

export type DrawFunctionInvocationContext = {
  fixedStateCache: any[], // state that persists between fixed timesteps
  update: Function,
  fixedUpdate: Function,
  fixedUpdateFPS: number,
  start: number,
  end: number
}

export type TimelineInvocationContext = {
  drawFunctions: DrawFunctionInvocationContext[],
  start: number,
  end: number
}

export function drawTimeline(context: TimelineInvocationContext, canvas: HTMLCanvasElement, time: number) {
  if (time > context.end || time < context.start) return;
  const localTime = time - context.start;
  for (const drawFnInvocation of context.drawFunctions) {
    if (localTime >= drawFnInvocation.start && localTime <= drawFnInvocation.end) {
      callDrawFunction(drawFnInvocation, canvas, localTime);
    }
  }
}

export function callDrawFunction(
  context: DrawFunctionInvocationContext, 
  canvas: HTMLCanvasElement,
  currentTime: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to create canvas context.");

  const frame = (currentTime - context.start) * context.fixedUpdateFPS;
  const nextFrame = Math.floor(frame + 1);
  const prevFrame = Math.floor(frame);

  while (context.fixedStateCache.length <= nextFrame) {
    let calledNext = false
    context.fixedUpdate({
      width: canvas.width,
      height: canvas.height,
      time: currentTime - context.start,
      duration: context.end - context.start,
      next: (nextFixedState: any) => {
        if (!calledNext) {
          context.fixedStateCache.push(nextFixedState);
          calledNext = true;
        } else {
          throw new Error("Cannot set next fixed state twice!");
        }
      },
      prev: context.fixedStateCache[context.fixedStateCache.length - 1],
    });
    if (!calledNext) {
      context.fixedStateCache.push(undefined);
    }
  }

  const nextFixed = context.fixedStateCache[nextFrame];
  const prevFixed = context.fixedStateCache[prevFrame];

  const fixed = (f: (fixed: any) => any) => {
    const next = f(nextFixed);
    if (typeof next != "number") throw new Error("Can only interpolate between numbers!");
    const prev = f(prevFixed);
    if (typeof prev != "number") throw new Error("Can only interpolate between numbers!");
    const x = frame % 1;
    const factor =  x * x * (3 - 2 * x);
    return prev + factor * (next - prev);
  }



  context.update({
    ctx,
    width: canvas.width,
    height: canvas.height,
    time: currentTime - context.start,
    duration: context.end - context.start,
    fixed
  });
}