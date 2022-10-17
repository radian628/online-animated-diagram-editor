import React, { useState } from "react";
import { useEffect } from "react";
import { TimelineParser } from "../app-state/State";
import { useAppStore } from "../app-state/StateManager";
import { callDrawFunction, createDrawFunction, createTimelineInvocationContext, DrawFunctionInvocationContext, drawTimeline, TimelineInvocationContext } from "../rendering/CreateDrawFunction";

export function Display() {
    const canvasRef = React.createRef<HTMLCanvasElement>();

    const [currentDisplayTimelineUUID, files, time] =
        useAppStore(state => [state.currentDisplayTimelineUUID, state.state.files, state.currentTimelineTime]);

    const [cachedTimelineState, setCachedTimelineState] = useState<TimelineInvocationContext | undefined>();

    const [err, setErr] = useState("");

    useEffect(() => {
        const file = files[currentDisplayTimelineUUID];
        if (!file) throw new Error("Timeline does not exist.");
        const maybeParsedFile = TimelineParser.safeParse(JSON.parse(file.data));
        if (!maybeParsedFile.success) throw new Error("Invalid timeline format.");
        const parsedFile = maybeParsedFile.data;
        let failed = false;
        try {
            setCachedTimelineState(createTimelineInvocationContext(parsedFile, 0, 8, files));
        } catch (err) {
            failed = true;
            setErr((err as Error)?.message);
        }
        if (!failed) setErr("");
    }, [currentDisplayTimelineUUID, files]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const c = canvasRef.current;

        if (!cachedTimelineState) return;
        c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
        try {
            drawTimeline(cachedTimelineState, c, time);
        } catch (err) {
            setErr("Render failed:" + (err as Error)?.message);
        }
    });

    return <div>
        <p>{err}</p>
        <canvas ref={canvasRef}></canvas>
    </div>
}