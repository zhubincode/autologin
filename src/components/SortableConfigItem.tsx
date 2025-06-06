import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PresetConfig } from "../types";

interface SortableConfigItemProps {
  config: PresetConfig;
  isSelected: boolean;
  onSelect: (config: PresetConfig) => void;
  onEdit: (id: string, updates: Partial<PresetConfig>) => Promise<void>; // 添加Promise返回类型
  onDelete: (id: string) => void;
  darkMode: boolean;
}

export const SortableConfigItem = ({
  config,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  darkMode,
}: SortableConfigItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editValues, setEditValues] = useState({
    displayName: config.displayName,
    description: config.description || "",
    icon: config.icon || "",
    key: config.key || "",
  });

  // 当config更新时，同步editValues - 这是关键修复
  useEffect(() => {
    setEditValues({
      displayName: config.displayName,
      description: config.description || "",
      icon: config.icon || "",
      key: config.key || "",
    });
  }, [config.displayName, config.description, config.icon, config.key]); // 添加具体的依赖项

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: config.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 调用父组件的编辑函数并等待完成
      await onEdit(config.id, editValues);
      // 添加一个短暂延迟确保UI更新
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsEditing(false);
    } catch (error) {
      console.error('保存配置失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // 重置为当前config的值
    setEditValues({
      displayName: config.displayName,
      description: config.description || "",
      icon: config.icon || "",
      key: config.key || "",
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(config.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('删除配置失败:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading 旋转动画组件
  const LoadingSpinner = ({ size = "w-4 h-4" }: { size?: string }) => (
    <svg
      className={`${size} animate-spin`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${
        isDragging ? "z-50" : ""
      }`}
    >
      <div
        className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
          isEditing
            ? darkMode
              ? "border-yellow-500 bg-yellow-900/20 shadow-lg shadow-yellow-500/20"
              : "border-yellow-500 bg-yellow-50 shadow-lg shadow-yellow-500/20"
            : isSelected
            ? darkMode
              ? "border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/20"
              : "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20"
            : darkMode
              ? "border-slate-600 bg-slate-700/30 hover:border-slate-500"
              : "border-slate-200 bg-white/50 hover:border-slate-300"
        } ${
          !isEditing && !isSaving && !isDeleting ? "cursor-pointer hover:scale-105" : ""
        } ${
          (isSaving || isDeleting) ? "opacity-75" : ""
        }`}
        onClick={() => !isEditing && !isSaving && !isDeleting && onSelect(config)}
        onDoubleClick={() => {
          if (!isEditing && !isSaving && !isDeleting && config.source === "custom") {
            setIsEditing(true);
          }
        }}
      >
        {/* Loading 遮罩层 */}
        {(isSaving || isDeleting) && (
          <div className="absolute inset-0 bg-black/10 rounded-xl flex items-center justify-center z-10">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              darkMode ? "bg-slate-800/90 text-white" : "bg-white/90 text-slate-900"
            } shadow-lg`}>
              <LoadingSpinner />
              <span className="text-sm font-medium">
                {isSaving ? "保存中..." : "删除中..."}
              </span>
            </div>
          </div>
        )}

        {/* 拖拽手柄 */}
        <div
          {...attributes}
          {...listeners}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing p-1 rounded ${
            darkMode ? "text-slate-400 hover:bg-slate-600" : "text-slate-500 hover:bg-slate-200"
          } ${
            (isSaving || isDeleting) ? "pointer-events-none opacity-30" : ""
          }`}
          title="拖拽排序"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>

        <div className="flex items-start space-x-4 ml-6">
          {/* 图标编辑 */}
          {isEditing ? (
            <input
              type="text"
              value={editValues.icon}
              onChange={(e) =>
                setEditValues({ ...editValues, icon: e.target.value })
              }
              disabled={isSaving}
              className={`w-12 h-12 text-center text-2xl border rounded-lg transition-all ${
                darkMode
                  ? "bg-slate-600 border-slate-500 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              } ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="🔧"
            />
          ) : (
            <div className="text-3xl w-12 h-12 flex items-center justify-center">
              {config.icon}
            </div>
          )}

          <div className="flex-1">
            {/* 名称编辑 */}
            {isEditing ? (
              <input
                type="text"
                value={editValues.displayName}
                onChange={(e) =>
                  setEditValues({ ...editValues, displayName: e.target.value })
                }
                disabled={isSaving}
                className={`w-full text-lg font-semibold mb-2 px-2 py-1 border rounded transition-all ${
                  darkMode
                    ? "bg-slate-600 border-slate-500 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                } ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            ) : (
              <h4
                className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {config.displayName}
              </h4>
            )}

            {/* 描述编辑 */}
            {isEditing ? (
              <textarea
                value={editValues.description}
                onChange={(e) =>
                  setEditValues({ ...editValues, description: e.target.value })
                }
                disabled={isSaving}
                className={`w-full text-sm px-2 py-1 border rounded resize-none transition-all ${
                  darkMode
                    ? "bg-slate-600 border-slate-500 text-slate-300"
                    : "bg-white border-slate-300 text-slate-600"
                } ${
                  isSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                rows={2}
              />
            ) : (
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {config.description}
              </p>
            )}

            {/* Key 编辑（仅自定义配置） */}
            {config.source === "custom" && (
              <div className="mt-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editValues.key}
                    onChange={(e) =>
                      setEditValues({ ...editValues, key: e.target.value })
                    }
                    disabled={isSaving}
                    className={`text-xs font-mono px-2 py-1 border rounded transition-all ${
                      darkMode
                        ? "bg-slate-600 border-slate-500 text-slate-300"
                        : "bg-white border-slate-300 text-slate-600"
                    } ${
                      isSaving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    placeholder="配置键名"
                  />
                ) : (
                  config.key && (
                    <div
                      className={`text-xs font-mono px-2 py-1 rounded inline-block ${
                        darkMode
                          ? "bg-slate-600 text-slate-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {config.source}: {config.key}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="absolute top-2 right-2 flex space-x-1">
          {isEditing ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={isSaving}
                className={`p-1 rounded transition-all duration-200 ${
                  isSaving
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
                title="保存"
              >
                {isSaving ? (
                  <LoadingSpinner />
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                disabled={isSaving}
                className={`p-1 rounded transition-colors ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-gray-600"
                } text-white`}
                title="取消"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </>
          ) : (
            <>
              {/* 编辑按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                disabled={isSaving || isDeleting}
                className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded ${
                  (isSaving || isDeleting)
                    ? "bg-blue-400 cursor-not-allowed"
                    : darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
                title={config.source === "custom" || config.isCustom ? "编辑配置" : "编辑配置（将创建自定义副本）"}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>

              {/* 删除按钮（仅自定义配置） */}
              {(config.source === "custom" || config.isCustom) && (
                <>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                      disabled={isSaving || isDeleting}
                      className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded ${
                        (isSaving || isDeleting)
                          ? "bg-red-400 cursor-not-allowed"
                          : darkMode
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                      title="删除自定义配置"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  ) : (
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        disabled={isDeleting}
                        className={`p-1 rounded transition-all duration-200 text-xs ${
                          isDeleting
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        } text-white`}
                        title="确认删除"
                      >
                        {isDeleting ? (
                          <LoadingSpinner size="w-3 h-3" />
                        ) : (
                          "✓"
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(false);
                        }}
                        disabled={isDeleting}
                        className={`p-1 rounded transition-colors text-xs ${
                          isDeleting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gray-500 hover:bg-gray-600"
                        } text-white`}
                        title="取消删除"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};