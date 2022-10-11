import { useState } from "react";
import { useAppStore } from "../app-state/StateManager";
import { Helpable } from "./Common";

export function Help(props: {
    setIsActive: (b: boolean) => void;
}) {
    const [setSetHelpBoxMessage, setOnActiveHelpBoxChange, onActiveHelpBoxChange] = useAppStore(
      state => [state.setSetHelpBoxMessage, state.setOnActiveHelpBoxChange, state.onActiveHelpBoxChange]
    );
    
    const [isActive, setIsActive] = useState(false);

    const [myHelpBoxMessage, setMyHelpBoxMessage] = useState<string | JSX.Element | JSX.Element[]>(
        "Click this panel."
    );
  //
  
    return <Helpable
        message={<ul>
            <li>Click a help panel to select it.</li>
            <li>Hovering over any part of the app will display it in the help panel.</li>
            <li>Press <kbd>H</kbd> to lock it on whatever tooltip it is currently displaying.</li>
        </ul>}
    ><div
        className={`help-panel panel-root`}
        onClick={e => {
            setSetHelpBoxMessage(msg => {
                setMyHelpBoxMessage(msg);
            });
            props.setIsActive(true);
            onActiveHelpBoxChange();
            setOnActiveHelpBoxChange(() => {
                props.setIsActive(false);
            });
        }}
    >
        <h2>Help Panel</h2> 
        <br></br>
        {myHelpBoxMessage}
    </div></Helpable>
}