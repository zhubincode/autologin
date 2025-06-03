export interface PresetConfig {
  id: string;
  displayName: string;
  source: "localStorage" | "cookie" | "all";
  key?: string;
  value?: string;
  icon?: string;
  description?: string;
}