import type { ThemeId } from "@/shared/config/constants";

export const THEME_MENU_CARDS: {
  id: ThemeId;
  name: string;
  tag: string;
  previewClass: string;
}[] = [
  {
    id: "light",
    name: "Light",
    tag: "Day",
    previewClass: "preview-light",
  },
  {
    id: "dark",
    name: "Dark",
    tag: "Night",
    previewClass: "preview-dark",
  },
];
