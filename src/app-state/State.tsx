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
    drawables: z.array(z.object({
      start: z.number(),
      end: z.number(),
      drawableID: z.string()
    }))
  }))
});
export type Timeline = z.infer<typeof TimelineParser>;

export const JSDrawableParser = z.object({
  type: z.literal("js"),
  src: z.string()
});
export type JSDrawable = z.infer<typeof JSDrawableParser>;

export const DrawableParser = z.discriminatedUnion("type", [
  TimelineParser,
  JSDrawableParser
]);
export type Drawable = z.infer<typeof DrawableParser>;