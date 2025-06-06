import React, { useState } from "react";
import { PresetConfig } from "../types";

interface CustomConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Omit<PresetConfig, "id" | "isCustom" | "createdAt">) => void;
  darkMode: boolean;
  editingConfig?: PresetConfig;
}

export const CustomConfigModal: React.FC<CustomConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  darkMode,
  editingConfig,
}) => {
  const [formData, setFormData] = useState({
    displayName: editingConfig?.displayName || "",
    source: editingConfig?.source || ("localStorage" as const),
    key: editingConfig?.key || "",
    icon: editingConfig?.icon || "🔧",
    description: editingConfig?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName.trim()) return;

    onSave({
      displayName: formData.displayName.trim(),
      source: formData.source,
      key: formData.source !== "all" ? formData.key.trim() : undefined,
      icon: formData.icon,
      description: formData.description.trim(),
    });

    setFormData({
      displayName: "",
      source: "localStorage",
      key: "",
      icon: "🔧",
      description: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`
        relative w-full max-w-md rounded-xl shadow-2xl border
        transform transition-all duration-300 ease-out
        animate-scale-in
        ${
          darkMode
            ? "bg-slate-800 border-slate-600"
            : "bg-white border-gray-200"
        }
      `}
      >
        <div className="p-6">
          <h2
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {editingConfig ? "编辑配置" : "添加自定义配置"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                配置名称
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
                className={`
                  w-full px-3 py-2 rounded-lg border transition-colors
                  ${
                    darkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
                placeholder="输入配置名称"
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                数据源
              </label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    source: e.target.value as "localStorage" | "cookie" | "all",
                  }))
                }
                className={`
                  w-full px-3 py-2 rounded-lg border transition-colors
                  ${
                    darkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
              >
                <option value="localStorage">localStorage</option>
                <option value="cookie">Cookie</option>
                <option value="all">全部数据</option>
              </select>
            </div>

            {formData.source !== "all" && (
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  键名
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, key: e.target.value }))
                  }
                  className={`
                    w-full px-3 py-2 rounded-lg border transition-colors
                    ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                  `}
                  placeholder="输入键名"
                  required
                />
              </div>
            )}

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                图标
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, icon: e.target.value }))
                }
                className={`
                  w-full px-3 py-2 rounded-lg border transition-colors
                  ${
                    darkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
                placeholder="选择一个emoji图标"
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={`
                  w-full px-3 py-2 rounded-lg border transition-colors resize-none
                  ${
                    darkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
                rows={3}
                placeholder="输入配置描述"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-medium transition-colors
                  ${
                    darkMode
                      ? "bg-slate-600 hover:bg-slate-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }
                `}
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {editingConfig ? "更新" : "添加"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
