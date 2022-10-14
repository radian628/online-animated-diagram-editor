import React from "react";
import { useEffect } from "react";
import { callDrawFunction, createDrawFunction, DrawFunctionInvocationContext } from "../rendering/CreateDrawFunction";

export function Display() {
    const canvasRef = React.createRef<HTMLCanvasElement>();

    useEffect(() => {
        if (!canvasRef.current) return;
        const c = canvasRef.current;
        
        const fn = createDrawFunction({
            settings: [],
            type: "js",
            onUpdate: "ctx.fillText('hello world', width * time / duration, height * time / duration)",
            onFixedUpdate: "",
            fixedRefreshRate: 60
        });

        const context: DrawFunctionInvocationContext = {
            fixedStateCache: [],
            update: fn.update,
            fixedUpdate: fn.fixedUpdate,
            start: 0,
            end: 100,
            fixedUpdateFPS: 60
        }

        callDrawFunction(
            context, 
            c, 15);

    });

    return <canvas ref={canvasRef}></canvas>
}