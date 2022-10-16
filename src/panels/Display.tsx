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

    useEffect(() => {
        const file = files[currentDisplayTimelineUUID];
        if (!file) throw new Error("Timeline does not exist.");
        const maybeParsedFile = TimelineParser.safeParse(JSON.parse(file.data));
        if (!maybeParsedFile.success) throw new Error("Invalid timeline format.");
        const parsedFile = maybeParsedFile.data;
        console.log(parsedFile);
        setCachedTimelineState(createTimelineInvocationContext(parsedFile, 0, 8, files));
    }, [currentDisplayTimelineUUID]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const c = canvasRef.current;

        if (!cachedTimelineState) return;
        c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
        drawTimeline(cachedTimelineState, c, time);
    });

    return <canvas ref={canvasRef}></canvas>
}