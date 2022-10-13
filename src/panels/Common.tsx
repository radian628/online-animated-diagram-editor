import { useEffect, useState } from "react";
import { useAppStore } from "../app-state/StateManager";
import { v4 as uuidv4 } from "uuid";

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