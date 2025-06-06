import React from "react";
import { PresetConfig } from "../types";

interface ConfigSelectorProps {
  configs: PresetConfig[];
  selectedConfig: PresetConfig | null;
  onSelect: (config: PresetConfig) => void;
  onDeleteCustom: (id: string) => void;
  onAddCustom: () => void;
  darkMode: boolean;
}

export const ConfigSelector = ({
  configs,
  selectedConfig,
  onSelect,
  onDeleteCustom,
  onAddCustom,
  darkMode,
}: ConfigSelectorProps) => {
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
      </div>

      <div className="space-y-4">
        {configs.map((config) => (
          <div key={config.id} className="relative group">
            <button
              onClick={() => onSelect(config)}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                selectedConfig?.id === config.id
                  ? darkMode
                    ? "border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/20"
                    : "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20"
                  : darkMode
                  ? "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                  : "border-slate-200 bg-white/50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{config.icon}</div>
                <div className="flex-1">
                  <h4
                    className={`text-lg font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {config.displayName}
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {config.description}
                  </p>
                  {config.key && (
                    <div
                      className={`mt-2 text-xs font-mono px-2 py-1 rounded ${
                        darkMode
                          ? "bg-slate-600 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {config.source}: {config.key}
                    </div>
                  )}
                </div>
              </div>
            </button>

            {config.source === "custom" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCustom(config.id);
                }}
                className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded ${
                  darkMode
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                title="删除自定义配置"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}

        {/* 在配置列表后添加"添加自定义配置"按钮 */}
        <div className="space-y-4">
          {configs.map((config) => (
            <div key={config.id} className="relative group">
              <button
                onClick={() => onSelect(config)}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                  selectedConfig?.id === config.id
                    ? darkMode
                      ? "border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/20"
                      : "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20"
                    : darkMode
                    ? "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                    : "border-slate-200 bg-white/50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{config.icon}</div>
                  <div className="flex-1">
                    <h4
                      className={`text-lg font-semibold mb-2 ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {config.displayName}
                    </h4>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {config.description}
                    </p>
                    {config.key && (
                      <div
                        className={`mt-2 text-xs font-mono px-2 py-1 rounded ${
                          darkMode
                            ? "bg-slate-600 text-slate-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {config.source}: {config.key}
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* 删除按钮 - 只对自定义配置显示 */}
              {config.source === "custom" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustom(config.id);
                  }}
                  className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded ${
                    darkMode
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                  title="删除自定义配置"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
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
      </div>
    </div>
  );
};
