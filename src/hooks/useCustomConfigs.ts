import { useLocalStorage } from "./useLocalStorage";
import { PresetConfig } from "../types";

export const useCustomConfigs = () => {
  const [customConfigs, setCustomConfigs] = useLocalStorage<PresetConfig[]>(
    "autologin-custom-configs",
    []
  );

  const addCustomConfig = (
    config: Omit<PresetConfig, "id" | "isCustom" | "createdAt">
  ) => {
    const newConfig: PresetConfig = {
      ...config,
      id: `custom-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    setCustomConfigs((prev) => [...prev, newConfig]);
    return newConfig;
  };

  const updateCustomConfig = (id: string, updates: Partial<PresetConfig>) => {
    setCustomConfigs((prev) =>
      prev.map((config) =>
        config.id === id ? { ...config, ...updates } : config
      )
    );
  };

  const deleteCustomConfig = (id: string) => {
    setCustomConfigs((prev) => prev.filter((config) => config.id !== id));
  };

  return {
    customConfigs,
    addCustomConfig,
    updateCustomConfig,
    deleteCustomConfig,
  };
};
