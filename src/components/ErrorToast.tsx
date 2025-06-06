import React, { useEffect } from "react";
import { AppError } from "../types";

// 支持单个错误的接口
interface SingleErrorToastProps {
  type: "warning" | "error" | "info" | "success";
  message: string;
  details?: string;
  onClose: () => void;
  darkMode: boolean;
}

// 支持多个错误的接口
interface MultipleErrorToastProps {
  errors: AppError[];
  onRemove: (timestamp: string) => void;
}

type ErrorToastProps = SingleErrorToastProps | MultipleErrorToastProps;

// 类型守卫函数
function isSingleError(props: ErrorToastProps): props is SingleErrorToastProps {
  return "type" in props;
}

export const ErrorToast: React.FC<ErrorToastProps> = (props) => {
  if (isSingleError(props)) {
    // 处理单个错误
    const { type, message, details, onClose, darkMode } = props;

    useEffect(() => {
      const timer = setTimeout(
        () => {
          onClose();
        },
        type === "error" ? 5000 : 3000
      );
      return () => clearTimeout(timer);
    }, [onClose, type]);

    return (
      <div
        className={`
          max-w-sm p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm
          transform transition-all duration-300 ease-in-out
          animate-slide-in-right
          ${
            type === "error"
              ? "bg-red-50/90 border-red-500 text-red-800"
              : type === "warning"
              ? "bg-yellow-50/90 border-yellow-500 text-yellow-800"
              : type === "success"
              ? "bg-green-50/90 border-green-500 text-green-800"
              : "bg-blue-50/90 border-blue-500 text-blue-800"
          }
          ${darkMode ? "dark:bg-slate-800/90 dark:text-white" : ""}
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {type === "error"
                  ? "❌"
                  : type === "warning"
                  ? "⚠️"
                  : type === "success"
                  ? "✅"
                  : "ℹ️"}
              </span>
              <p className="font-medium">{message}</p>
            </div>
            {details && <p className="mt-1 text-sm opacity-80">{details}</p>}
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-lg hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </div>
      </div>
    );
  } else {
    // 处理多个错误（原有逻辑）
    const { errors, onRemove } = props;

    useEffect(() => {
      errors.forEach((error) => {
        const timer = setTimeout(
          () => {
            onRemove(error.timestamp);
          },
          error.type === "error" ? 5000 : 3000
        );
        return () => clearTimeout(timer);
      });
    }, [errors, onRemove]);

    if (errors.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {errors.map((error) => (
          <div
            key={error.timestamp}
            className={`
              max-w-sm p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm
              transform transition-all duration-300 ease-in-out
              animate-slide-in-right
              ${
                error.type === "error"
                  ? "bg-red-50/90 border-red-500 text-red-800"
                  : error.type === "warning"
                  ? "bg-yellow-50/90 border-yellow-500 text-yellow-800"
                  : error.type === "success"
                  ? "bg-green-50/90 border-green-500 text-green-800"
                  : "bg-blue-50/90 border-blue-500 text-blue-800"
              }
            `}
          >
            {/* 错误内容渲染逻辑 */}
          </div>
        ))}
      </div>
    );
  }
};
