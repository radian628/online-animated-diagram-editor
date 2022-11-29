import React from "react";
import { useEffect, useState } from "react";
import { TimelineParser } from "../../app-state/State";
import { useAppStore } from "../../app-state/StateManager";
import {
  createTimelineInvocationContext,
  drawTimeline,
  TimelineInvocationContext,
} from "../../rendering/CreateDrawFunction";
import { ApngExportSettings } from "./ApngExportSettings";
import { GifExportSettings } from "./GifExportSettings";

type ExportFormat = "gif" | "apng";

export function Export() {
  const [currentDisplayTimelineUUID, files, time] = useAppStore((state) => [
    state.currentDisplayTimelineUUID,
    state.state.files,
    state.currentTimelineTime,
  ]);

  const [cachedTimelineState, setCachedTimelineState] = useState<
    TimelineInvocationContext | undefined
  >();

  const [err, setErr] = useState("");

  useEffect(() => {
    const file = files[currentDisplayTimelineUUID];
    if (!file) throw new Error("Timeline does not exist.");
    const maybeParsedFile = TimelineParser.safeParse(JSON.parse(file.data));
    if (!maybeParsedFile.success) throw new Error("Invalid timeline format.");
    const parsedFile = maybeParsedFile.data;
    let failed = false;
    try {
      setCachedTimelineState(
        createTimelineInvocationContext(parsedFile, 0, 8, files)
      );
    } catch (err) {
      failed = true;
      setErr((err as Error)?.message);
    }
    if (!failed) setErr("");
  }, [currentDisplayTimelineUUID, files]);

  const [isExporting, setIsExporting] = useState(false);

  const [exportFrame, setExportFrame] = useState(0);

  useEffect(() => {
    if (isExporting && cachedTimelineState) {
      const canvas = document.createElement("canvas");
      try {
        drawTimeline(cachedTimelineState, canvas, exportFrame / 60);
      } catch (err) {
        setErr("Render failed:" + (err as Error)?.message);
      }

      (async () => {
        const blob: Blob | null = await new Promise((res, rej) => {
          canvas.toBlob((blob) => res(blob));
        });
        if (blob) {
          await fetch(`http://localhost:8080/image/${exportFrame}.png`, {
            method: "POST",
            headers: {
              Accept: "application.json",
              "Content-Type": "application/octet-stream",
            },
            body: blob,
          });
        }
      })();

      setTimeout(() => {
        if (exportFrame / 60 > cachedTimelineState.end) {
          setIsExporting(false);
          const video_type = "mp4";
          const images = new Array(exportFrame)
            .fill(0)
            .map((e, i) => `../microservice-interface/images/${i}.png`);
          const path_out = "./test.mp4";
          const fps = 60.0;

          fetch("http://localhost:8080/service/service", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              video_type: video_type,
              images,
              path_out: path_out,
              fps: fps,
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
        }
        setExportFrame(exportFrame + 1);
      }, 0);
    }
  }, [isExporting, exportFrame]);

  return (
    <React.Fragment>
      <button
        onClick={(e) => {
          setIsExporting(true);
          setExportFrame(0);
        }}
      >
        Export Video
      </button>
      {isExporting && <p>Frame {exportFrame}</p>}
      <p>{err}</p>
    </React.Fragment>
  );
}
