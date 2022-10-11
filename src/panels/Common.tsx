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

  return <div
    {...removeAttribs(props, "children", "message")}
    className="helpable"
    onMouseEnter={() => {
      if (setHelpBoxMessage) setHelpBoxMessage(props.message);
    }}
    onMouseMove={() => {
      if (setHelpBoxMessage) setHelpBoxMessage(props.message);
    }}
  >
    {props.children}
  </div>
}