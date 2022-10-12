import { useEffect, useState } from "react";
import { useAppStore } from "../app-state/StateManager";

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

export function Helpable(props: {
  children: string | JSX.Element | JSX.Element[],
  message: string | JSX.Element | JSX.Element[]
} & React.HTMLAttributes<HTMLInputElement>) {
  const [setHelpBoxMessage] = useAppStore(
    state => [state.setHelpBoxMessage]
  );

  const [isMouseOver, setIsMouseOver] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (isMouseOver && e.key == "h" && (document.activeElement === document.body || document.activeElement?.tagName === "BUTTON")) {
        if (setHelpBoxMessage) setHelpBoxMessage(props.message);
      }
    }
    document.addEventListener("keydown", keydown);
    
    const mousemove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
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
    {isMouseOver ? 
    <div
      style={{
        position: "absolute",
        top: `${mousePos.y}px`,
        left: `${mousePos.x}px`,
      }}
      className="helpable-info"
    >?</div>
    : undefined}
  </div>
}