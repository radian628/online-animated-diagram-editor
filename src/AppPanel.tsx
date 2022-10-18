import React, { useEffect, useState } from "react";
import { IoAdd, IoClose, IoCaretBack, IoCaretForward, IoCaretUp, IoCaretDown } from "react-icons/io5";
import { Helpable, ResizeSeparator } from "./panels/Common";
import { PanelTypeSelector } from "./panels/PanelTypeSelector";
import { SingleAppPanel, SingleAppPanelState, SinglePanelType } from "./SingleAppPanel";
import { v4 as uuidv4 } from "uuid";
import { AddPanelGrid } from "./AddPanelGrid";

export enum PanelDirection {
  HORIZONTAL,
  VERTICAL,
}

export enum PanelType {
  SINGLE,
  MULTIPLE
}

export type Single = {
  type: PanelType.SINGLE;
  panel: SingleAppPanelState
  key: string;
};
export type Multiple = {
  type: PanelType.MULTIPLE;
  children: Panel[];
  direction: PanelDirection;
  key: string;
};

export type Panel = (
  Single
  | Multiple
) & {
  size: number;
};

let counter = 5;
function makeKey() {
  return "key" + counter++;
}



// Nestable app panel
export function AppPanel(props: {
  data: Panel;
  setData: (p: Panel) => void;
  style?: React.CSSProperties;
  outerStyle?: React.CSSProperties;
  direction: PanelDirection;
  onResize: (delta: number) => void;
  onDelete?: () => void;
  lastChild?: boolean;
  onAddPanel?: (positive: boolean) => void
}) {
  
  const [isActive, setIsActive] = useState(false);

  // Is the "add a new panel" grid open?
  const [isAdding, setIsAdding] = useState(false);

  const [uuid] = useState(uuidv4());

  const [isPanelFocused, setIsPanelFocused] = useState(false);

  // Delete empty "multiple" panels
  useEffect(() => {
    if (props.data.type != PanelType.MULTIPLE) return;
    if (props.data.children.length == 0 && props.onDelete) props.onDelete();
  });

  // keybind for adding a panel
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key == "n" && isPanelFocused && document.activeElement?.className == "app-panel-inner-single") {
        setIsAdding(true);
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
    }
  })

  // determine inner content of the panels
  let inner;
  const parentRef = React.createRef<HTMLDivElement>();

  // case with multiple child panels
  if (props.data.type == PanelType.MULTIPLE) {
    let totalChildSize = props.data.children.reduce((prev, cur) => prev + cur.size, 0);

    inner = (
      <div
        style={{
          ...props.style,
          display: "grid",
          gridTemplateRows:
            props.data.direction == PanelDirection.VERTICAL
              ? props.data.children.map((child) => `${child.size / totalChildSize * 2}fr`).join(" ")
              : undefined,
          gridTemplateColumns:
            props.data.direction == PanelDirection.HORIZONTAL
              ? props.data.children.map((child) => `${child.size / totalChildSize * 2}fr`).join(" ")
              : undefined,
          height: "100%"
        }}
      >
        
        {props.data.children.map((panel, i) => {
          if (props.data.type != PanelType.MULTIPLE) return undefined;
          return (
            <React.Fragment key={panel.key}>
              <AppPanel

                onDelete={() => {
                  if (props.data.type != PanelType.MULTIPLE) return undefined;
                  props.setData({
                    ...props.data,
                    children: props.data.children.filter((c, j) => j != i)
                  });
                }}
              
                onResize={(delta) => {
                  if (props.data.type != PanelType.MULTIPLE) return undefined;
                  let totalSize = props.data.children.reduce((prev, curr) => prev + curr.size, 0);
                  let rect = parentRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  let adjustedDelta = delta / ((props.data.direction == PanelDirection.VERTICAL) ? rect.height : rect.width) * totalSize;
                  let newChildren = [...props.data.children];
                  newChildren[i].size += adjustedDelta;
                  if (newChildren[i + 1]) newChildren[i + 1].size -= adjustedDelta;
                  props.setData({
                    ...props.data,
                    children: newChildren,
                  });
                }}

                data={panel}
                setData={(p) => {
                  if (props.data.type != PanelType.MULTIPLE) return undefined;
                  props.setData({
                    ...props.data,
                    children: props.data.children.map((child, j) =>
                      j == i ? p : child
                    ),
                  });
                }}

                direction={props.data.direction}

                lastChild={i == props.data.children.length - 1}

                onAddPanel={positive => {
                  if (props.data.type != PanelType.MULTIPLE) return undefined;
                  let newChildren = [...props.data.children];
                  let newSize = panel.size / 2;
                  newChildren[i].size = newSize;
                  if (positive) {
                    newChildren.splice(i + 1, 0, {
                      type: PanelType.SINGLE,
                      panel: { type: SinglePanelType.UNDECIDED },
                      size: newSize,
                      key: makeKey()
                    });
                  } else {
                    newChildren.splice(i, 0, {
                      type: PanelType.SINGLE,
                      panel: { type: SinglePanelType.UNDECIDED },
                      size: newSize,
                      key: makeKey()
                    });
                  }
                  props.setData({
                    ...props.data,
                    children: newChildren
                  })
                }}
              ></AppPanel>
            </React.Fragment>
          );
        })}
      </div>
    );
  } else {
    inner = (
      <div 
        style={{ flexGrow: 1 }}
        tabIndex={0}
        onFocus={e => {
          setIsPanelFocused(true);
        }}
        onBlur={e => {
          setIsPanelFocused(false);
        }}
        className="app-panel-inner-single"
      >
        <SingleAppPanel
          setIsActive={setIsActive}
          isActive={isActive}
          type={props.data.panel.type}
        ></SingleAppPanel>
      </div>
    );
  }



  return (
    <div
      style={{
        display: "flex",
        overflowY: "auto",
        alignItems: "stretch",
        minHeight: 0,
        flexDirection:
          props.direction == PanelDirection.VERTICAL ? "column" : "row",
        willChange: "transform"
      }}
    >
      {
        isAdding ?
        <AddPanelGrid
          onExit={() => setIsAdding(false)}
          onAddPanel={(direction, positive) => {
            setIsAdding(false);
            if (props.onAddPanel) {
              if (direction == props.direction) {
                props.onAddPanel(positive);
              } else {
                const oldPanel = { ...props.data, size: props.data.size / 2 };
                const newPanel: Panel = { type: PanelType.SINGLE, panel: { type: SinglePanelType.UNDECIDED }, key: makeKey(), size: props.data.size / 2 };
                props.setData({
                  type: PanelType.MULTIPLE,
                  size: props.data.size,
                  key: makeKey(),
                  direction: (props.direction == PanelDirection.VERTICAL) ? PanelDirection.HORIZONTAL : PanelDirection.VERTICAL,
                  children: positive ? [oldPanel, newPanel] : [newPanel, oldPanel] 
                })
              }
            }
          }}
        ></AddPanelGrid>
        : undefined }
        <div
          style={{
            ...props.outerStyle,
            flexGrow: 1
          }}
          ref={parentRef}
          className={
            props.data.type == PanelType.MULTIPLE
              ? "app-panel-multiple app-panel"
              : "app-panel-single app-panel" + (isActive ? " is-active-panel" : "")
          }
        >
          {props.data.type == PanelType.MULTIPLE ? undefined : (
            <div>
              {props.onDelete ? 
              <Helpable
                message="Press this button to delete the given panel. You will have to re-open the panel and whatever was inside it, but anything inside will still be saved."
              >
                <button onClick={props.onDelete} className="close-panel-button"><IoClose></IoClose></button> 
              </Helpable>
              : undefined}
              <PanelTypeSelector
                panelType={props.data.panel.type}
                setPanelType={type => {
                  if (props.data.type != PanelType.SINGLE) return;
                  props.setData({
                    ...props.data,
                    panel: {
                      ...props.data.panel,
                      type
                    }
                  });
                }}
              ></PanelTypeSelector>

              <Helpable
                message={<p>Press this button to split this panel. This can also be done with the <kbd>N</kbd> key.</p>}
              >       
                <button onClick={() => {
                  setIsAdding(true);
                }} className="add-panel-button"><IoAdd></IoAdd></button>
              </Helpable>
            </div>
          )}
          {inner}
        </div>
      {props.lastChild ? undefined : <ResizeSeparator
        onMove={(delta) => {
          props.onResize(delta);
        }}
        direction={props.direction}
      ></ResizeSeparator> }
    </div>
  );
}
