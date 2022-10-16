import React from "react";
import { useEffect, useState } from "react";
import { AppState, Timeline, TimelineParser } from "../../app-state/State";
import { useAppStore } from "../../app-state/StateManager";
import { PanelDirection } from "../../AppPanel";
import { arraySet, ResizeSeparator, useElemSize } from "../Common";

import "./TimelineEditor.css";


type TimelineClip = Timeline["timeline"][number];

export function TimelineClip(props: {
  clip: TimelineClip,
  right: number,
  left: number,
  files: AppState["files"],
  trackWidth: number,
  trackYOffset: number,
  setClip: (clip: TimelineClip) => void
}) {
  let range = props.right - props.left;
  let clipStart = (props.clip.start - Math.min(0, props.left)) / range;
  let clipEnd = (props.clip.end - Math.min(0, props.left)) / range;
  
  let [isMouseDown, setIsMouseDown] = useState(false);

  let [temporaryClipYDelta, setTemporaryClipYDelta] = useState(0);
  let [previousTrack, setPreviousTrack] = useState(0);

  
  useEffect(() => {
    if (isMouseDown) {
      const mouseup = () => {
        setIsMouseDown(false);
      };
      document.addEventListener("mouseup", mouseup);

      const mousemove = (e: MouseEvent) => {
        if (!isMouseDown) return;
        let deltaX = e.movementX / props.trackWidth * range;
        deltaX = Math.max(props.clip.start + deltaX, 0) - props.clip.start;
        let deltaY = e.movementY / 50 + temporaryClipYDelta;
        props.setClip({
          ...props.clip,
          start: props.clip.start + deltaX,
          end: props.clip.end + deltaX,
          track: Math.max(0, Math.round(previousTrack + deltaY))
        });

        setTemporaryClipYDelta(deltaY);
      }
      document.addEventListener("mousemove", mousemove);

      return () => {
        document.removeEventListener("mouseup", mouseup);
        document.removeEventListener("mousemove", mousemove);
      }
    }
  }, [isMouseDown, props.clip]);

  return <div
    style={{
      position: "absolute",
      left: `${clipStart * 100}%`,
      width: `${(clipEnd - clipStart) * 100}%`,
      top: `${props.clip.track * 50}px`,
      willChange: "transform"
    }}
    className="clip"
  >
    <ResizeSeparator
      direction={PanelDirection.HORIZONTAL}
      onMove={e => {
        let newStart = props.clip.start + e / props.trackWidth * range;
        newStart = Math.min(newStart, props.clip.end);
        props.setClip({
          ...props.clip,
          start: newStart
        });
      }}
      isAtStart={true}
    ></ResizeSeparator>
    <div
      className="clip-inner"
      onMouseDown={e => {
        if (e.button == 0) {
          setIsMouseDown(true);
          setPreviousTrack(props.clip.track);
          setTemporaryClipYDelta(0);
        }
      }}
    >
      {props.files[props.clip.drawableID]?.name ?? "Does not exist."}
    </div>
    <ResizeSeparator
      direction={PanelDirection.HORIZONTAL}
      onMove={e => {
        let newEnd = props.clip.end + e / props.trackWidth * range;
        newEnd = Math.max(props.clip.start, newEnd);
        props.setClip({
          ...props.clip,
          end: newEnd
        });
      }}
    ></ResizeSeparator>
  </div>
}





export function TimelineEditor(props: { uuid: string }) {
  const [files, setFile] = useAppStore(state => [state.state.files, state.setFile]);
  const file = files[props.uuid];

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(4);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const [recentlyWheeled, setRecentlyWheeled] = useState(false)

  if (!file) {
      return <p>Error: File does not exist.</p>
  }

  const maybeParsedFile = TimelineParser.safeParse(JSON.parse(file.data));
  if (!maybeParsedFile.success) {
      console.log(maybeParsedFile.error);
      return <p>Error: File claims to be a Timeline but is in the wrong format.</p>
  }
  const parsedFile = maybeParsedFile.data;

  const [mousePos, setMousePos] = useState<[number, number]>([0, 0]);

  const [timelineEditorRef, timelineEditorRect] = useElemSize<HTMLDivElement>();

  return <div>
    <h1>Editing '{file.name}'</h1>
    <div 
      ref={timelineEditorRef}
      tabIndex={0}
      className="timeline"
      style={{
        height: `${
          (parsedFile.timeline
            .map(t => t.track)
            .reduce((prev, cur) => Math.max(prev, cur), -Infinity) + 2)
            * 50
        }px`
      }}
      onMouseMove={e => {
        setMousePos([e.clientX, e.clientY]);
      }}
      onKeyDown={e => {
        let rect = e.currentTarget.getBoundingClientRect();
        let x = (mousePos[0] - rect.left) / rect.width;
        let weightedCenter = left + (right - left) * x;
        if (e.key != "=" && e.key != "-") return;
        let delta = (e.key == "=") ? -1 : 1;
        let factor = (delta * 0.3 + 1);
        let newleft = weightedCenter + (left - weightedCenter) * factor;
        let newright = weightedCenter + (right - weightedCenter) * factor;
        if (newleft < 0) {
          newright -= newleft;
          newleft -= newleft;
        }
        setLeft(newleft);
        setRight(newright);

        let newLeftScroll = (newleft / (newright - newleft) * rect.width);
        e.currentTarget.scrollLeft = Math.max(0, newLeftScroll);
        setScrollLeft(e.currentTarget.scrollLeft);
        return false;
      }}
      onScroll={e => {
        let width = e.currentTarget.getBoundingClientRect().width;
        const delta = e.currentTarget.scrollLeft - scrollLeft;
        setScrollLeft(e.currentTarget.scrollLeft);
        setLeft(left + delta / width * (right - left));
        setRight(right + delta / width * (right - left));
      }}
    >
      {parsedFile.timeline.map((clip, i) => {
        return <TimelineClip
          trackWidth={timelineEditorRect?.width ?? 1000}
          trackYOffset={timelineEditorRect?.top ?? 0}
          clip={clip}
          left={left}
          right={right}
          files={files}
          setClip={clip2 => {
            setFile(props.uuid, JSON.stringify({
              ...parsedFile,
              timeline: arraySet(parsedFile.timeline, i, clip2)
            }))
          }}
        ></TimelineClip>
      })}
    </div>
  </div>
}