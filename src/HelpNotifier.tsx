import React from "react";
import { useAppStore } from "./app-state/StateManager";

export function HelpNotifier() {
  const [helpNotifierData] = useAppStore(state => [state.helpNotifierData]);
  return <React.Fragment>{helpNotifierData ? 
      <div
        style={{
          position: "absolute",
          top: `${helpNotifierData.y + 20}px`,
          left: `${helpNotifierData.x + 20}px`,
        }}
        className="helpable-info"
      >{helpNotifierData.content}</div>
  : undefined}</React.Fragment>
}