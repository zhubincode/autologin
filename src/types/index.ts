export interface PresetConfig {
  id: string;
  displayName: string;
  source: "localStorage" | "cookie" | "all" | "custom";
  key?: string;
  value?: string;
  icon?: string;
  description?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface HistoryRecord {
  id: string;
  config: PresetConfig;
  configId: string;
  generatedCode: string;
  timestamp: string;
  success?: boolean;
  errorMessage?: string;
  name?: string;
  icon?: string;
}

export interface AppError {
  id: string;
  type: "warning" | "error" | "info" | "success";
  message: string;
  details?: string;
  timestamp: string;
}
