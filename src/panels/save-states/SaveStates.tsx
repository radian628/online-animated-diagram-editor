import { useState } from "react";
import { useAppStore } from "../../app-state/StateManager";
import { TwoStepButton } from "../../common-components/TwoStepButton";
import { StringInput } from "../Common";

export function SaveStates() {
  const [saveStates, addSaveState, loadSaveState, deleteSaveState] =
    useAppStore((state) => [
      state.state.saveStates,
      state.addSaveState,
      state.loadSaveState,
      state.deleteSaveState,
    ]);

  const [saveStateName, setSaveStateName] = useState("");

  return (
    <div>
      <h1>Save States</h1>
      <StringInput val={saveStateName} setVal={setSaveStateName}></StringInput>
      <button
        onClick={() => {
          addSaveState(saveStateName);
        }}
      >
        Add Save State
      </button>
      {Object.entries(saveStates).map(([saveStateName, data]) => {
        return (
          <div>
            <h2>{saveStateName}</h2>
            <TwoStepButton
              onFinalClick={() => {
                loadSaveState(saveStateName);
              }}
            >
              Restore
            </TwoStepButton>
            <TwoStepButton
              onFinalClick={() => {
                deleteSaveState(saveStateName);
              }}
            >
              Delete
            </TwoStepButton>
          </div>
        );
      })}
    </div>
  );
}
