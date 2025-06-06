import { useLocalStorage } from "./useLocalStorage";
import { HistoryRecord, PresetConfig } from "../types";
import { useCallback } from "react";

export const useHistory = () => {
  const [history, setHistory, isClient] = useLocalStorage<HistoryRecord[]>(
    "autologin-history",
    []
  );

  const addToHistory = useCallback(
    (
      config: PresetConfig,
      code: string,
      success: boolean = true,
      errorMessage?: string
    ) => {
      const record: HistoryRecord = {
        id: Date.now().toString(),
        config,
        configId: config.id,
        generatedCode: code,
        timestamp: new Date().toISOString(),
        success,
        errorMessage,
        name: config.displayName,
        icon: config.icon,
      };

      setHistory((prev) => [record, ...prev.slice(0, 49)]); // 保留最近50条记录
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const removeFromHistory = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((record) => record.id !== id));
    },
    [setHistory]
  );

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    isClient,
  };
};
