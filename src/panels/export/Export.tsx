import { useState } from "react";
import { ApngExportSettings } from "./ApngExportSettings";
import { GifExportSettings } from "./GifExportSettings";

type ExportFormat = "gif" | "apng";

export function Export() {
    const [exportFormat, setExportFormat] = useState<ExportFormat>("gif");

    switch (exportFormat) {
    case "gif":
        return <GifExportSettings></GifExportSettings>;
    case "apng":
        return <ApngExportSettings></ApngExportSettings>
    }
}