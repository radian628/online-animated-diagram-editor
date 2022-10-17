import { AppState, JSDrawableParser } from "./State";

export function tryGetJSDrawable(files: AppState["files"], fileid: string) {
    const file = files[fileid];
    if (!file) {
        return undefined;
    }
  
    const maybeParsedFile = JSDrawableParser.safeParse(JSON.parse(file.data));
    if (!maybeParsedFile.success) {
        return undefined;
    }
    return maybeParsedFile.data;
}