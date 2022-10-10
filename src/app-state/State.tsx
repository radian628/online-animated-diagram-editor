export type ID = string;

export type AppState = {
  rootDrawableID: ID,
  drawables: Record<ID, Drawable>
}

export type TimelineTrack = {
  drawables: {
    start: number,
    end: number,
    drawable: Drawable[]
  }[]
}

export type TimelineDrawable = {
  type: "multi"
  timeline: TimelineTrack[];
}

export type JSDrawable = {
  type: "js",
  src: string // javascript source code
}

export type Drawable = JSDrawable | TimelineDrawable;