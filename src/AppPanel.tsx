import React, { useEffect, useState } from "react";
import { IoAdd, IoClose } from "react-icons/io5";

export enum PanelDirection {
  HORIZONTAL,
  VERTICAL,
}

export enum PanelType {
  UNDECIDED,
  TIMELINE,
  DISPLAY,
  SETTINGS,
  CODE_EDITOR,
  MULTIPLE,
}

export type Undecided = {
  type: PanelType.UNDECIDED;
  key: string;
};
export type Timeline = {
  type: PanelType.TIMELINE;
  key: string;
};
export type Display = {
  type: PanelType.DISPLAY;
  key: string;
};
export type Settings = {
  type: PanelType.SETTINGS;
  key: string;
};
export type CodeEditor = {
  type: PanelType.CODE_EDITOR;
  key: string;
};
export type Multiple = {
  type: PanelType.MULTIPLE;
  children: Panel[];
  direction: PanelDirection;
  key: string;
};

export type Panel = (
  | Timeline
  | Display
  | Settings
  | CodeEditor
  | Multiple
  | Undecided
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

export function AppPanel(props: {
  data: Panel;
  setData: (p: Panel) => void;
  style?: React.CSSProperties;
  outerStyle?: React.CSSProperties;
  direction: PanelDirection;
  onResize: (delta: number) => void;
  onDelete?: () => void;
}) {
  
  let inner;
  const parentRef = React.createRef<HTMLDivElement>();
  if (props.data.type == PanelType.MULTIPLE) {
    if (props.data.children.length == 0 && props.onDelete) props.onDelete();
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
              ></AppPanel>
            </React.Fragment>
          );
        })}
      </div>
    );
  } else {
    inner = (
      <div style={{ flexGrow: 1 }}>
        <p>
          {
            {
              [PanelType.TIMELINE]: "timeline",
              [PanelType.DISPLAY]: "display",
              [PanelType.SETTINGS]: "settings",
              [PanelType.CODE_EDITOR]: "editor",
              [PanelType.UNDECIDED]: "undecided",
            }[props.data.type]
          }
        </p>
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
      <div
        style={{
          ...props.outerStyle,
          flexGrow: 1
        }}
        ref={parentRef}
        className={
          props.data.type == PanelType.MULTIPLE
            ? "app-panel-multiple app-panel"
            : "app-panel"
        }
      >
        {props.data.type == PanelType.MULTIPLE ? undefined : (
          <div>
            {props.onDelete ? <button onClick={props.onDelete} className="close-panel-button"><IoClose></IoClose></button> : undefined}
            <button className="add-panel-button"><IoAdd></IoAdd></button>
          </div>
        )}
        {inner}
      </div>
      <ResizeSeparator
        onMove={(delta) => {
          props.onResize(delta);
        }}
        direction={props.direction}
      ></ResizeSeparator>
    </div>
  );
}
