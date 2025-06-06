import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HistoryRecord } from "../types";

interface HistoryPanelProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
  onRemoveRecord: (id: string) => void;
  onUseRecord: (record: HistoryRecord) => void;
  darkMode: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
  onRemoveRecord,
  onUseRecord,
  darkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 确保在客户端创建portal容器
    setPortalContainer(document.body);
  }, []);

  const modalContent = isOpen && portalContainer ? (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: '16px'
      }}
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}
      />

      {/* 模态框主体 */}
      <div
        className={`
        relative w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl border
        transform transition-all duration-300 ease-out
        animate-scale-in overflow-hidden
        ${
          darkMode
            ? "bg-slate-800 border-slate-600"
            : "bg-white border-gray-200"
        }
      `}
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '32rem',
          maxHeight: '80vh',
          width: '100%'
        }}
      >
        {/* 固定头部 */}
        <div
          className={`sticky top-0 p-6 border-b ${
            darkMode
              ? "bg-slate-800 border-slate-600"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📚</span>
              <h2
                className={`font-bold text-xl ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                历史记录
              </h2>
              <span
                className={`
                px-3 py-1 rounded-full text-sm font-bold
                ${darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}
              `}
              >
                {history.length} 条记录
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {history.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearHistory();
                  }}
                  className={`
                    px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium
                    hover:scale-105 shadow-md flex items-center space-x-2
                    ${
                      darkMode
                        ? "bg-red-600/80 hover:bg-red-700/80 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }
                  `}
                >
                  <span>🗑️</span>
                  <span>清空全部</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={`
                  px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium
                  hover:scale-105 shadow-md flex items-center space-x-2
                  ${
                    darkMode
                      ? "bg-slate-600/80 hover:bg-slate-700/80 text-white"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
                  }
                `}
              >
                <span>✕</span>
                <span>关闭</span>
              </button>
            </div>
          </div>
        </div>

        {/* 历史记录列表 */}
        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {history.length === 0 ? (
            <div
              className={`text-center py-12 ${
                darkMode ? "text-slate-400" : "text-gray-500"
              }`}
            >
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg font-medium">暂无历史记录</p>
              <p className="text-sm mt-2">开始使用配置后，历史记录将显示在这里</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div
                  key={record.id}
                  className={`
                  p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                  ${
                    darkMode
                      ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700/70"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }
                `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-2xl">{record.icon}</span>
                      <div className="flex-1">
                        <h4
                          className={`font-medium text-base ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {record.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${
                              record.success
                                ? darkMode
                                  ? "bg-green-600/20 text-green-400 border border-green-600/30"
                                  : "bg-green-100 text-green-700 border border-green-200"
                                : darkMode
                                ? "bg-red-600/20 text-red-400 border border-red-600/30"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }
                          `}
                          >
                            {record.success ? "✓ 成功" : "✗ 失败"}
                          </span>
                          <span
                            className={`text-xs ${
                              darkMode ? "text-slate-400" : "text-gray-500"
                            }`}
                          >
                            {new Date(record.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onUseRecord(record);
                          setIsOpen(false);
                        }}
                        className={`
                          px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium
                          hover:scale-105 shadow-md flex items-center space-x-1
                          ${
                            darkMode
                              ? "bg-blue-600/80 hover:bg-blue-700/80 text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }
                        `}
                      >
                        <span>📋</span>
                        <span>使用</span>
                      </button>
                      <button
                        onClick={() => onRemoveRecord(record.id)}
                        className={`
                          px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium
                          hover:scale-105 shadow-md flex items-center space-x-1
                          ${
                            darkMode
                              ? "bg-red-600/80 hover:bg-red-700/80 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }
                        `}
                      >
                        <span>🗑️</span>
                        <span>删除</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
          hover:scale-105 shadow-lg backdrop-blur-sm
          ${
            darkMode
              ? "bg-slate-700/80 hover:bg-slate-600/80 text-white border border-slate-600"
              : "bg-white/80 hover:bg-gray-50/80 text-gray-800 border border-gray-200"
          }
        `}
      >
        <span className="text-lg">📚</span>
        <span>历史记录</span>
        <span
          className={`
          px-2 py-0.5 rounded-full text-xs font-bold
          ${darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}
        `}
        >
          {history.length}
        </span>
      </button>

      {/* 使用Portal渲染模态框到body */}
      {portalContainer && createPortal(modalContent, portalContainer)}
    </>
  );
};
