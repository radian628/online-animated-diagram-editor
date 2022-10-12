import { useEffect, useState } from "react";
import { useAppStore } from "../app-state/StateManager";
import { Helpable } from "./Common";
import { v4 as uuidv4 } from "uuid";
import { IoLockOpen, IoLockClosed } from "react-icons/io5";

export function Help(props: {
    setIsActive: (b: boolean) => void;
    isActive: boolean
}) {
    const [activeHelpBoxUUID, setActiveHelpBoxUUID, helpBoxMessage] = useAppStore(
      state => [state.activeHelpBoxUUID, state.setActiveHelpBoxUUID, state.helpBoxMessage]
    );

    const [isLocked, setIsLocked] = useState(false);

    const [uuid] = useState(uuidv4());

    const [myHelpBoxMessage, setMyHelpBoxMessage] = useState<string | JSX.Element | JSX.Element[]>(
        "Click this panel to select it."
    );

    useEffect(() => {
        if (uuid == activeHelpBoxUUID && !isLocked) {
            setMyHelpBoxMessage(helpBoxMessage);
        }
    }, [helpBoxMessage, isLocked]);
  
    useEffect(() => {

        if (uuid == activeHelpBoxUUID) {
            const keydown = (e: KeyboardEvent) => {
                if (e.key == "h" && e.getModifierState("Control")) {
                    setIsLocked(!isLocked);
                }
            }
            if (!props.isActive) props.setIsActive(true);
            
            document.addEventListener("keydown", keydown);
            return () => document.removeEventListener("keydown", keydown);
        } else {
            if (props.isActive) props.setIsActive(false);
        }
    }); 
  
    return <Helpable
        message={<ul>
            <li>Click a help panel to select it.</li>
            <li>Hover over something in the app, and information about it will display here.</li>
            <li>Press <kbd>Ctrl+H</kbd> to lock the selected help panel, preventing it from changing until unlocked.</li>
        </ul>}
    ><div
        className={`help-panel panel-root`}
        onClick={e => {
            setActiveHelpBoxUUID(uuid);
        }}
    >
        <h2>Help Panel {isLocked ? <IoLockClosed></IoLockClosed> : undefined}</h2> 
        <br></br>
        {myHelpBoxMessage}
    </div></Helpable>
}