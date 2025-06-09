import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PresetConfig } from "../types";
import { SortableConfigItem } from "./SortableConfigItem";

interface ConfigSelectorProps {
  configs: PresetConfig[];
  selectedConfig: PresetConfig | null;
  onSelect: (config: PresetConfig) => void;
  onReorder: (configs: PresetConfig[]) => void;
  onEditConfig: (id: string, updates: Partial<PresetConfig>) => void;
  onDeleteCustom: (id: string) => void;
  onAddCustom: () => void;
  darkMode: boolean;
}

export const ConfigSelector = ({
  configs,
  selectedConfig,
  onSelect,
  onReorder,
  onEditConfig,
  onDeleteCustom,
  onAddCustom,
  darkMode,
}: ConfigSelectorProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 移动距离后才开始拖拽
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = configs.findIndex((config) => config.id === active.id);
      const newIndex = configs.findIndex((config) => config.id === over.id);

      const newConfigs = arrayMove(configs, oldIndex, newIndex);
      onReorder(newConfigs);
    }
  };

  // 如果配置为空，显示骨架屏
  if (configs.length === 0) {
    return (
      <div className={`rounded-2xl p-8 backdrop-blur-xl border shadow-2xl ${
        darkMode
          ? "bg-slate-800/50 border-slate-700"
          : "bg-white/70 border-slate-200"
      }`}>
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg animate-pulse"></div>
          <div className={`h-6 w-24 rounded animate-pulse ${
            darkMode ? "bg-slate-600" : "bg-slate-200"
          }`}></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-6 rounded-xl border-2 animate-pulse ${
              darkMode ? "bg-slate-700/30 border-slate-600" : "bg-white/50 border-slate-200"
            }`}>
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg ${
                  darkMode ? "bg-slate-600" : "bg-slate-300"
                }`}></div>
                <div className="flex-1 space-y-2">
                  <div className={`h-5 w-32 rounded ${
                    darkMode ? "bg-slate-600" : "bg-slate-300"
                  }`}></div>
                  <div className={`h-4 w-48 rounded ${
                    darkMode ? "bg-slate-600" : "bg-slate-300"
                  }`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-8 backdrop-blur-xl border shadow-2xl custom-scrollbar ${
        darkMode
          ? "bg-slate-800/50 border-slate-700"
          : "bg-white/70 border-slate-200"
      }`}
      style={{ maxHeight: "800px", overflowY: "auto" }}
    >
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        </div>
        <h3
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          配置选择
        </h3>
        <div
          className={`text-sm px-3 py-1 rounded-full ${  // 改为圆角胶囊样式
            darkMode
              ? "bg-slate-600/80 text-slate-300 border border-slate-500"
              : "bg-slate-100/80 text-slate-600 border border-slate-300"
          }`}
        >
          🔄 支持拖拽排序
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={configs.map((config) => config.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {configs.map((config) => (
              <SortableConfigItem
                key={config.id}
                config={config}
                isSelected={selectedConfig?.id === config.id}
                onSelect={onSelect}
                onEdit={async (id, updates) => await onEditConfig(id, updates)}
                onDelete={onDeleteCustom}
                darkMode={darkMode}
              />
            ))}

            {/* 添加自定义配置按钮 */}
            <button
              onClick={onAddCustom}
              className={`w-full p-6 rounded-xl border-2 border-dashed transition-all duration-300 text-center hover:scale-105 ${
                darkMode
                  ? "border-slate-600 bg-slate-700/30 hover:border-slate-500 text-slate-300"
                  : "border-slate-300 bg-white/50 hover:border-slate-400 text-slate-600"
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="text-3xl">➕</div>
                <div>
                  <h4
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    添加自定义配置
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    创建您自己的登录配置
                  </p>
                </div>
              </div>
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
