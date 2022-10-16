import * as z from "zod";


export const FileParser = z.object({
  name: z.string(),
  tags: z.array(z.string()),
  data: z.string(), // Data, base64 encoded if in binary
  type: z.string()  // MIME type (or something along those lines)
});
export type File = z.infer<typeof FileParser>;

export const AppStateParser = z.object({
  rootDrawableID: z.string(),
  files: z.record(FileParser),
  tags: z.record(z.object({
    name: z.string(),
    color: z.string()
  }))
});
export type AppState = z.infer<typeof AppStateParser>;

export const TimelineParser = z.object({
  type: z.literal("timeline"),
  timeline: z.array(z.object({
    start: z.number(),
    end: z.number(),
    track: z.number().refine(x => Math.round(x) == x),
    drawableID: z.string()
  }))
});
export type Timeline = z.infer<typeof TimelineParser>;

export const JSDrawableParser = z.object({
  settings: z.array(z.object({
    type: z.union([z.literal("number"), z.literal("string")]),
    varName: z.string()
  })),
  type: z.literal("js"),
  onUpdate: z.string(),
  onFixedUpdate: z.string(),
  fixedRefreshRate: z.number()
});
export type JSDrawable = z.infer<typeof JSDrawableParser>;

export const DrawableParser = z.discriminatedUnion("type", [
  TimelineParser,
  JSDrawableParser
]);
export type Drawable = z.infer<typeof DrawableParser>;