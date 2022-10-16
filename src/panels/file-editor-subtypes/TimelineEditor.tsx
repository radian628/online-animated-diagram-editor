import { useEffect, useState } from "react";
import { Timeline, TimelineParser } from "../../app-state/State";
import { useAppStore } from "../../app-state/StateManager";

import "./TimelineEditor.css";


export function TimelineTrack(props: {
  track: Timeline["timeline"]
}) {

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

  return <div>
    <h1>Editing '{file.name}'</h1>
    <div 
      tabIndex={0}
      className="timeline"
      onMouseMove={e => {
        setMousePos([e.clientX, e.clientY]);
      }}
      onKeyDown={e => {
        let width = e.currentTarget.getBoundingClientRect().width;
        let x = mousePos[0] / width;
        let weightedCenter = left + (right - left) * x;
        if (e.key != "=" && e.key != "-") return;
        let delta = (e.key == "=") ? -1 : 1;
        let factor = (delta * 0.3 + 1);
        let newleft = weightedCenter + (left - weightedCenter) * factor;
        let newright = weightedCenter + (right - weightedCenter) * factor;
        setLeft(newleft);
        setRight(newright);

        let newLeftScroll = (newleft / (newright - newleft) * width);
        e.currentTarget.scrollLeft = Math.max(0, newLeftScroll);
        setScrollLeft(e.currentTarget.scrollLeft);
        return false;
      }}
      onScroll={e => {
        console.log("scrollevent")
        let width = e.currentTarget.getBoundingClientRect().width;
        const delta = e.currentTarget.scrollLeft - scrollLeft;
        setScrollLeft(e.currentTarget.scrollLeft);
        setLeft(left + delta / width * (right - left));
        setRight(right + delta / width * (right - left));
      }}
    >
      {parsedFile.timeline.map(track => {
        return <div className="timeline-track">
          {
            track.drawables.map(drawable => {
              let range = right - left;
              let clipStart = (drawable.start - Math.min(0, left)) / range;
              let clipEnd = (drawable.end - Math.min(0, left)) / range;
              return <div
                draggable={true}
                style={{
                  position: "absolute",
                  left: `${clipStart * 100}%`,
                  width: `${(clipEnd - clipStart) * 100}%`,
                  top: `0px`,
                }}
                className="clip"
              >{files[drawable.drawableID]?.name ?? "Does not exist."}</div>
            })
          }
        </div>
      })}
    </div>
  </div>
}