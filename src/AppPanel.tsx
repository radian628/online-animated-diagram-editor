import React, { useEffect, useState } from "react";
import { IoAdd, IoClose, IoCaretBack, IoCaretForward, IoCaretUp, IoCaretDown } from "react-icons/io5";
import { Helpable } from "./panels/Common";
import { PanelTypeSelector } from "./panels/PanelTypeSelector";
import { SingleAppPanel, SingleAppPanelState, SinglePanelType } from "./SingleAppPanel";

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

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

export function ResizeSeparator(props: {
  onMove: (delta: number) => void;
  direction: PanelDirection;
}) {
  const [lastMousePos, setLastMousePos] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const mousemove = (e: MouseEvent) => {
      if (isMouseDown) {
        if (props.direction == PanelDirection.HORIZONTAL) {
          props.onMove(mouseX - lastMousePos[0]);
        } else {
          props.onMove(mouseY - lastMousePos[1]);
        }
        setLastMousePos([mouseX, mouseY]);
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
          setLastMousePos([mouseX, mouseY]);
          (document.querySelector(".App") as HTMLDivElement).style.userSelect =
            "none";
        }
      }}
      className={`resize-separator ${
        props.direction == PanelDirection.VERTICAL
          ? "resize-vertical"
          : "resize-horizontal"
      }`}
    ></div>
  );
}



function AddPanelGrid(props: {
  onExit: () => void
  onAddPanel: (direction: PanelDirection, positive: boolean) => void
}) {

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.key == "ArrowUp") {
                props.onAddPanel(PanelDirection.VERTICAL, false)
            } else if (e.key == "ArrowLeft") {
                props.onAddPanel(PanelDirection.HORIZONTAL, false)
            } else if (e.key == "ArrowRight") {
                props.onAddPanel(PanelDirection.HORIZONTAL, true)
            } else if (e.key == "ArrowDown") {
                props.onAddPanel(PanelDirection.VERTICAL, true)
            }
        }
        document.addEventListener("keydown", keydown);
        return () => {
            document.removeEventListener("keydown", keydown);
        }
    })

  return <div 
    onMouseLeave={props.onExit}
  className="add-panel-container">
    <Helpable
        style={{
            gridColumnStart: 2,
            gridColumnEnd: 3
        }}
        message={<p>Click to add the new panel above the current one. You can also do this with the <kbd>Up Arrow</kbd> key.</p>}
    >
        <button
        className="add-panel-direction-button"
        onClick={() => props.onAddPanel(PanelDirection.VERTICAL, false)}
        ><IoCaretUp></IoCaretUp></button>
    </Helpable>
    <Helpable
        style={{
        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 2,
        gridRowEnd: 3,
        }}
        message={<p>Click to add the new panel to the left of the current one. You can also do this with the <kbd>Left Arrow</kbd> key.</p>}
    >
    <button
        className="add-panel-direction-button"
      onClick={() => props.onAddPanel(PanelDirection.HORIZONTAL, false)}
    ><IoCaretBack></IoCaretBack></button>
    </Helpable>
    <Helpable
        style={{
        gridColumnStart: 3,
        gridColumnEnd: 4,
        gridRowStart: 2,
        gridRowEnd: 3,
        }}
        message={<p>Click to add the new panel to the right of the current one. You can also do this with the <kbd>Right Arrow</kbd> key.</p>}
    >
    <button
        className="add-panel-direction-button"
      onClick={() => props.onAddPanel(PanelDirection.HORIZONTAL, true)}
      ><IoCaretForward></IoCaretForward></button>
      </Helpable>
    <Helpable
        message={<p>Click to add the new panel below the current one. You can also do this with the <kbd>Down Arrow</kbd> key.</p>}
        style={{
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 3,
            gridRowEnd: 4,
        }}
    >
        <button
        className="add-panel-direction-button"
        onClick={() => props.onAddPanel(PanelDirection.VERTICAL, true)}
        ><IoCaretDown></IoCaretDown></button>
    </Helpable>
  </div>
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

  // Delete empty "multiple" panels
  useEffect(() => {
    if (props.data.type != PanelType.MULTIPLE) return;
    if (props.data.children.length == 0 && props.onDelete) props.onDelete();
  });

  // determine inner content of the panels
  let inner;
  const parentRef = React.createRef<HTMLDivElement>();

  // case with multiple child panels
  if (props.data.type == PanelType.MULTIPLE) {
    inner = (
      <div
        style={{
          ...props.style,
          display: "grid",
          gridTemplateRows:
            props.data.direction == PanelDirection.VERTICAL
              ? props.data.children.map((child) => `${child.size}fr`).join(" ")
              : undefined,
          gridTemplateColumns:
            props.data.direction == PanelDirection.HORIZONTAL
              ? props.data.children.map((child) => `${child.size}fr`).join(" ")
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
      <div style={{ flexGrow: 1 }}>
        <SingleAppPanel
          setIsActive={setIsActive}
          type={props.data.panel.type}
        ></SingleAppPanel>
      </div>
    );
  }



  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        flexDirection:
          props.direction == PanelDirection.VERTICAL ? "column" : "row",
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
        :
        <div
          style={{
            ...props.outerStyle,
            flexGrow: 1
          }}
          ref={parentRef}
          className={
            props.data.type == PanelType.MULTIPLE
              ? "app-panel-multiple app-panel"
              : "app-panel" + (isActive ? " is-active-panel" : "")
          }
        >
          {props.data.type == PanelType.MULTIPLE ? undefined : (
            <div>
              {props.onDelete ? 
              <Helpable
                message="Press this button to delete the given panel."
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
              <button onClick={() => {
                setIsAdding(true);
              }} className="add-panel-button"><IoAdd></IoAdd></button>
            </div>
          )}
          {inner}
        </div>
      }
      {props.lastChild ? undefined : <ResizeSeparator
        onMove={(delta) => {
          props.onResize(delta);
        }}
        direction={props.direction}
      ></ResizeSeparator> }
    </div>
  );
}
