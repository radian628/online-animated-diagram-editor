import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { IoPause, IoPlay } from "react-icons/io5";
import { AppState, Timeline, TimelineParser } from "../../app-state/State";
import { useAppStore } from "../../app-state/StateManager";
import { PanelDirection } from "../../AppPanel";
import { arraySet, mousePos, ResizeSeparator, useAnimationFrame, useCache, useElemSize, useMouseDown, useSize } from "../Common";
import useResizeObserver from "@react-hook/resize-observer";

import "./TimelineEditor.css";


type TimelineClip = Timeline["timeline"][number];

export function TimelineClip(props: {
  clip: TimelineClip,
  range: number
  files: AppState["files"],
  trackWidth: number,
  trackYOffset: number,
  setClip: (clip: TimelineClip) => void
}) {
  let range = props.range
  let clipStart = (props.clip.start) / range;
  let clipEnd = (props.clip.end) / range;
  
  let [isMouseDown, setIsMouseDown] = useState(false);

  let [temporaryClipYDelta, setTemporaryClipYDelta] = useState(0);
  let [previousTrack, setPreviousTrack] = useState(0);

  let [currentlyEditingClip, setOnEditClip, editClip] =
    useAppStore(state => [state.currentlyEditingClip, state.setOnEditClip, state.editClip]);
  
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
        editClip({
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
      top: `${props.clip.track * 50 + 20}px`,
      willChange: "transform"
    }}
    className="clip"
    onMouseDown={e => {
      if (e.button == 0) {
        setOnEditClip(props.clip, clip => {
          props.setClip(clip);
        });
      }
    }}
  >
    <ResizeSeparator
      direction={PanelDirection.HORIZONTAL}
      onMove={e => {
        let newStart = props.clip.start + e / props.trackWidth * range;
        newStart = Math.min(newStart, props.clip.end);
        editClip({
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
        editClip({
          ...props.clip,
          end: newEnd
        });
      }}
    ></ResizeSeparator>
  </div>
}



function TimelineTime(props: { time: number, style?: React.CSSProperties }) {
  if (props.time < 60) return <span className="timeline-time" style={props.style}>{
    Math.floor(props.time * 100 + 0.00000001) / 100
  }s</span>
  if (props.time < 3600) return <span className="timeline-time"  style={props.style}>{
    Math.floor(props.time / 60)
  }m{
    Math.floor(props.time * 100 + 0.00000001) / 100 % 60
  }s</span>
  return <span className="timeline-time"  style={props.style}>{
    Math.floor(props.time / 3600)
  }h{
    Math.floor(props.time / 60) % 60
  }m{
    Math.floor(props.time * 100 + 0.00000001) / 100 % 60
  }s</span>;
}



export function TimelineNumbers(props: {
  start: number,
  end: number,
  setCurrentTime: (time: number) => void
  parentLeft?: number,
  timelineDuration: number,
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const rect = useSize(ref);

  const isMouseDown = useMouseDown(ref, changeTime, true);

  const durationFactor = props.timelineDuration / (props.end - props.start);

  function changeTime(e: MouseEvent) {
    if (!(e.currentTarget instanceof HTMLElement) || !rect) return;
    props.setCurrentTime((e.clientX - rect.left) / rect.width * durationFactor * (props.end - props.start));
  }

  const numbers: JSX.Element[] = [];

  if (rect) {
    let step = props.end - props.start;
    step = 10 ** Math.floor(Math.log10(step / 3.5));
    for (let i = Math.floor(props.start / step) * step; i < props.end; i += step) {
      numbers.push(<TimelineTime
        key={i} 
        time={i}
        style={{
          position: "absolute",
          top: "0px",
          left: `${(i) / (props.end - props.start) * rect.width / durationFactor}px`
        }}
      ></TimelineTime>)
    }
  }

  return <div className="timeline-numbers" ref={ref}
    onMouseMove={e => {
      if (isMouseDown) changeTime(e.nativeEvent);
    }}
    style={{
      width: `${100 * durationFactor }%`
    }}
  >
    {numbers}
  </div>
}




export function TimelineEditor(props: { uuid: string }) {
  const [files, setFile, setCurrentTimelineTime] = 
    useAppStore(state => [state.state.files, state.setFile, state.setCurrentTimelineTime]);
  const file = files[props.uuid];

  const [range, setRange] = useState(4);
  const [scrollLeft, setScrollLeft] = useState(0);
  

  if (!file) {
      return <p>Error: File does not exist.</p>
  }

  const maybeParsedFile = TimelineParser.safeParse(JSON.parse(file.data));
  if (!maybeParsedFile.success) {
      return <p>Error: File claims to be a Timeline but is in the wrong format.</p>
  }
  const parsedFile = maybeParsedFile.data;
  const timelineEditorRef = React.useRef<HTMLDivElement>(null);
  // const [timelineEditorRef, timelineEditorRect] = useElemSize<HTMLDivElement>();
  const timelineEditorRect = useSize(timelineEditorRef);
  const rectTop = useCache(timelineEditorRect?.top);
  const rectWidth = useCache(timelineEditorRect?.width);
  console.log(rectWidth);
  
  const [currentTime, setCurrentTime] = useState(0);

  const timelinePixelHeight = (parsedFile.timeline
    .map(t => t.track)
    .reduce((prev, cur) => Math.max(prev, cur), -Infinity) + 2)
    * 50 + 20;

  const [isPlaying, setIsPlaying] = useState(false);
  const [playingStartTime, setPlayingStartTime] = useState(0);
  
  const resetTimeElapsed = useAnimationFrame<[boolean, number]>(([isPlaying, playingStartTime], timeElapsed) => {
    if (isPlaying) {
      const time = playingStartTime + timeElapsed / 1000;
      setCurrentTime(time);
      setCurrentTimelineTime(time);
    }
  }, [isPlaying, playingStartTime]);
  
  return <div>
    <h1>Editing '{file.name}'</h1>
    <button 
      className="timeline-play-button"
      style={{
        backgroundColor: isPlaying ? "#555555" : ""
      }}
      onClick={e => {
        setPlayingStartTime(currentTime);
        setIsPlaying(true);
        resetTimeElapsed();
      }}
    ><IoPlay></IoPlay></button>
    <button 
      onClick={e => {
        setIsPlaying(false);
      }}
      style={{
        backgroundColor: isPlaying ? "" : "#555555"
      }}
      className="timeline-pause-button"
    ><IoPause></IoPause></button>
    <div 
      ref={timelineEditorRef}
      tabIndex={0}
      className="timeline"
      style={{
        height: `${
          timelinePixelHeight
        }px`
      }}
      onMouseMove={e => {
      }}
      onKeyDown={e => {

        let rect = e.currentTarget.getBoundingClientRect();
        let scrollLeftTimeSpace = e.currentTarget.scrollLeft / rect.width * range;
        let x = (mousePos[0] - rect.left) / rect.width;
        let weightedCenter = scrollLeftTimeSpace + range * x;
        if (e.key != "=" && e.key != "-") return;
        let delta = (e.key == "=") ? -1 : 1;
        let factor = (delta * 0.3 + 1);

        setRange(factor * range);

        const newScrollLeft = Math.max(
          weightedCenter + (scrollLeftTimeSpace - weightedCenter) * factor,
          0
        );

        setScrollLeft(newScrollLeft);
        e.currentTarget.scrollLeft = newScrollLeft / (factor * range) * rect.width;

        return false;
      }}
      onScroll={e => {
        let width = e.currentTarget.getBoundingClientRect().width;
        setScrollLeft(e.currentTarget.scrollLeft / width * range);
      }}
    >
      <TimelineNumbers
        start={scrollLeft}
        end={scrollLeft + range}
        setCurrentTime={time => {
          setCurrentTime(time);
          setCurrentTimelineTime(time);
        }}
        timelineDuration={parsedFile.timeline
          .map(t => t.end)
          .reduce((a, b) => Math.max(a, b), 0)}
      ></TimelineNumbers>
      {parsedFile.timeline.map((clip, i) => {
        return <TimelineClip
          key={clip.uuid}
          trackWidth={rectWidth ?? 1000}
          trackYOffset={rectTop ?? 0}
          clip={clip}
          range={range}
          files={files}
          setClip={clip2 => {
            setFile(props.uuid, JSON.stringify({
              ...parsedFile,
              timeline: arraySet(parsedFile.timeline, i, clip2)
            }))
          }}
        ></TimelineClip>
      })}
      <div style={{
        borderRight: "1px solid black",
        position: "absolute",
        top: "0px",
        left: `${currentTime / range * (rectWidth ?? 0)}px`,
        height: `${timelinePixelHeight}px`,
        zIndex: 1000
      }}></div>
    </div>
  </div>
}