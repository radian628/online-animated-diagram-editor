import { useEffect, useState } from "react";
import { useAppStore } from "../app-state/StateManager";
import { Helpable } from "./Common";
import { v4 as uuidv4 } from "uuid";
import { IoLockOpen, IoLockClosed } from "react-icons/io5";

export function Help(props: {
  setIsActive: (b: boolean) => void;
  isActive: boolean;
}) {
  const [activeHelpBoxUUID, setActiveHelpBoxUUID, helpBoxMessage] = useAppStore(
    (state) => [
      state.activeHelpBoxUUID,
      state.setActiveHelpBoxUUID,
      state.helpBoxMessage,
    ]
  );

  const [uuid] = useState(uuidv4());

  const [myHelpBoxMessage, setMyHelpBoxMessage] = useState<
    string | JSX.Element | JSX.Element[]
  >("Click this panel to select it.");

  useEffect(() => {
    if (uuid == activeHelpBoxUUID) {
      setMyHelpBoxMessage(helpBoxMessage);
    }
  }, [helpBoxMessage]);

  useEffect(() => {
    if (uuid == activeHelpBoxUUID) {
      if (!props.isActive) props.setIsActive(true);
    } else {
      if (props.isActive) props.setIsActive(false);
    }
  });

  return (
    <Helpable
      message={
        <ul>
          <li>Click a help panel to select it.</li>
          <li>
            Want to save a tooltip for later? Press <kbd>H</kbd> while hovering
            over something to see info about it in the selected help panel
          </li>
        </ul>
      }
    >
      <div
        className={`help-panel panel-root`}
        onClick={(e) => {
          setActiveHelpBoxUUID(uuid);
        }}
      >
        <h2>Help Panel</h2>
        <br></br>
        <div className="help-box-content">{myHelpBoxMessage}</div>
      </div>
    </Helpable>
  );
}
