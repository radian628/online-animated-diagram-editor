export type ID = string;

export type AppState = {
  rootDrawableID: ID,
  drawables: Record<ID, Drawable>
}

export type MultiDrawable = {
  type: "multi"
}

export type JSDrawable = {
  type: "js",
  src: string // javascript source code

}

export type Drawable = JSDrawable | MultiDrawable;