import { useCallback, useState } from "react";
import {
  applyAppFontToDocument,
  ensureGoogleFontLoaded,
  persistAppFontId,
  readStoredAppFontId,
} from "@/shared/lib/font";
import { APP_FONT_OPTIONS, type AppFontId } from "@/shared/config/appFonts";

export function useFont() {
  const [fontId, setFontId] = useState<AppFontId>(readStoredAppFontId);

  const selectFont = useCallback((id: AppFontId) => {
    ensureGoogleFontLoaded(id);
    applyAppFontToDocument(id);
    persistAppFontId(id);
    setFontId(id);
  }, []);

  return {
    fontId,
    selectFont,
    options: APP_FONT_OPTIONS,
  };
}
