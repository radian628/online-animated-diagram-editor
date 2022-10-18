import React, { useEffect, useState } from "react";
import { useAppStore } from "../app-state/StateManager";
import { v4 as uuidv4 } from "uuid";
import { PanelDirection } from "../AppPanel";
import useResizeObserver from "@react-hook/resize-observer";

export function noUndefined<T>(obj: T): { [K in keyof T]: Exclude<T[K], undefined> } {
  //@ts-ignore
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== undefined));
}

export function removeAttribs<T, K extends (keyof T)[]>(obj: T, ...props: K): Omit<T, K[number]> {
  let objCopy = { ...obj };
  for (let key of props) {
    delete objCopy[key];
  }
  return objCopy;
}

export function StringInput(props: {
  val: string,
  setVal: (s: string) => void
} & React.HTMLAttributes<HTMLInputElement>) {
  return <input
    {...removeAttribs(props, "val", "setVal")}
    onInput={e => {
      props.setVal(e.currentTarget.value);
    }}
    value={props.val}
  ></input>
}


export function NumberInput(props: {
  val: number,
  setVal: (s: number) => void
} & React.HTMLAttributes<HTMLInputElement>) {
  return <input
    {...removeAttribs(props, "val", "setVal")}
    onInput={e => {
      props.setVal(Number(e.currentTarget.value));
    }}
    value={props.val.toString()}
  ></input>
}

export function Helpable(props: {
  children: string | JSX.Element | JSX.Element[],
  message: string | JSX.Element | JSX.Element[]
} & React.HTMLAttributes<HTMLInputElement>) {
  const [setHelpBoxMessage] = useAppStore(
    state => [state.setHelpBoxMessage]
  );

  const [helpNotifierData, setHelpNotifierData] = 
    useAppStore(state => [state.helpNotifierData, state.setHelpNotifierData]);

  const [isMouseOver, setIsMouseOver] = useState(false);

  const [uuid] = useState(uuidv4());

  useEffect(() => {
    return () => {
      const helpNotifierData = useAppStore.getState().helpNotifierData;
      if (helpNotifierData && helpNotifierData.uuid == uuid) {
        setHelpNotifierData(null);
      }
    }
  }, []);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (isMouseOver && e.key == "h" && (document.activeElement === document.body || document.activeElement?.tagName !== "INPUT")) {
        if (setHelpBoxMessage) setHelpBoxMessage(props.message);
      }
    }
    document.addEventListener("keydown", keydown);
    
    const mousemove = (e: MouseEvent) => {
      if (isMouseOver) {
        setHelpNotifierData({ x: e.clientX, y: e.clientY, uuid, content: props.message });
      } else if (helpNotifierData && helpNotifierData.uuid == uuid) {
        setHelpNotifierData(null);
      }
    }
    document.addEventListener("mousemove", mousemove);
    
    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("mousemove", mousemove);
    }
  })


  return <div
    {...removeAttribs(props, "children", "message")}
    className="helpable"
    onMouseOver={() => {
      setIsMouseOver(true);
    }}
    onMouseOut={() => {
      setIsMouseOver(false);
    }}
  >
    {props.children}
  </div>
}




export function arraySet<T>(arr: T[], i: number, newVal: T) {
  return arr.map((e, j) => (i == j) ? newVal : e);
}

export function useElemSize<T extends HTMLElement>() {
  const ref = React.createRef<T>();
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!rect) {
      const rect = ref.current?.getBoundingClientRect() ?? null;
      setRect(rect);
    }
  }, [rect]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(() => {
      const rect = ref.current?.getBoundingClientRect() ?? null;
      setRect(rect);
      console.log("asdasdasdasd")
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);


  return [ref,rect] as const;
}





let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});



export function ResizeSeparator(props: {
  onMove: (delta: number) => void;
  direction: PanelDirection;
  isAtStart?: boolean;
}) {

  useEffect(() => {
    const mousemove = (e: MouseEvent) => {
      if (isMouseDown) {
        if (props.direction == PanelDirection.HORIZONTAL) {
          props.onMove(e.movementX);
        } else {
          props.onMove(e.movementY);
        }
      }
    };
    const mouseup = (e: MouseEvent) => {
      if (e.button == 0) {
        (document.querySelector(".App") as HTMLDivElement).style.userSelect =
          "";
        setIsMouseDown(false);
      }
    };

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    return () => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
    };
  });

  const [isMouseDown, setIsMouseDown] = useState(false);
  return (
    <div
      onMouseDown={(e) => {
        if (e.button == 0) {
          setIsMouseDown(true);
          (document.querySelector(".App") as HTMLDivElement).style.userSelect =
            "none";
        }
      }}
      className={`resize-separator ${
        props.direction == PanelDirection.VERTICAL
          ? "resize-vertical"
          : "resize-horizontal"
      }`}
      style={props.isAtStart ? {
        left: "0"
      } : {}}
    ></div>
  );
}




export function useMouseDown(elemRef: React.RefObject<HTMLElement>, callback?: (e: MouseEvent) => void, appliesToChildren: boolean = true) {
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const mousedown = (e: MouseEvent) => {
      if (!appliesToChildren && e.currentTarget !== e.target) return;
      if (callback) callback(e);
      setIsMouseDown(true);
    }

    const mouseup = (e: MouseEvent) => {
      setIsMouseDown(false);
    }

    if (!elemRef.current) return;

    elemRef.current.addEventListener("mousedown", mousedown);
    document.addEventListener("mouseup", mouseup);

    return () => {
      if (!elemRef.current) return;
      elemRef.current.removeEventListener("mousedown", mousedown);
      document.removeEventListener("mouseup", mouseup);  
    }
  }, []);

  return isMouseDown;
}




export function useAnimationFrame<T extends readonly any[]>(
  callback: (updatedState: T, time: number) => void,
  dependencies: T
) {
  const animationRef = React.useRef<number>(0);

  const dependenciesRef = React.useRef<T>();
  dependenciesRef.current = dependencies;

  const [timeElapsedOffset, setTimeElapsedOffset] = useState(0);
  const timeElapsed = React.useRef(0);

  const animate = (time: number) => {
    timeElapsed.current = time;
    if (dependenciesRef.current) callback(dependenciesRef.current, time - timeElapsedOffset);
    animationRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  });

  return () => {
    setTimeElapsedOffset(timeElapsed.current);
  }
}


export let mousePos: [number, number] = [0, 0];
document.addEventListener("mousemove", e => {
  mousePos = [e.clientX, e.clientY];
});



export function useCache<T>(value2: T) {
  const [value, setValue] = useState(value2);

  useEffect(() => {
    if (value != value2) {
      setValue(value2);
    }
  });
  return value;
}


export const useSize = (target: React.MutableRefObject<HTMLElement | null>  ) => {
  const [size, setSize] = React.useState<DOMRect | undefined>()

  React.useLayoutEffect(() => {
    if (target.current) setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}