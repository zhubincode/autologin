import { useLocalStorage } from "./useLocalStorage";
import { PresetConfig } from "../types";
import { useCallback } from "react";

export const useConfigOrder = () => {
  const [configOrder, setConfigOrder] = useLocalStorage<Record<string, number>>(
    "autologin-config-order",
    {}
  );

  const updateConfigOrder = useCallback(
    (configs: PresetConfig[]) => {
      const newOrder: Record<string, number> = {};
      configs.forEach((config, index) => {
        newOrder[config.id] = index;
      });
      setConfigOrder(newOrder);
    },
    [setConfigOrder]
  );

  const getSortedConfigs = useCallback(
    (configs: PresetConfig[]): PresetConfig[] => {
      return [...configs].sort((a, b) => {
        const orderA = configOrder[a.id] ?? 999;
        const orderB = configOrder[b.id] ?? 999;
        return orderA - orderB;
      });
    },
    [configOrder]
  );

  return {
    configOrder,
    updateConfigOrder,
    getSortedConfigs,
  };
};