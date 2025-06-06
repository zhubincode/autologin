"use client";

import { useState, useEffect } from "react";
import { ConfigSelector } from "../components/ConfigSelector";
import { CodeDisplay } from "../components/CodeDisplay";
import { CustomConfigModal } from "../components/CustomConfigModal";
import { HistoryPanel } from "../components/HistoryPanel";
import { ErrorToast } from "../components/ErrorToast";
import { SunIcon, MoonIcon } from "../components/icons";
import { useTheme } from "../hooks/useTheme";
import { useCodeGenerator } from "../hooks/useCodeGenerator";
import { useHistory } from "../hooks/useHistory";
import { useCustomConfigs } from "../hooks/useCustomConfigs";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { PRESET_CONFIGS } from "../constants/presets";
import { PresetConfig, HistoryRecord } from "../types";

export default function Home() {
  const { darkMode, toggleDarkMode } = useTheme();
  const {
    generateCode,
    generatedCode,
    isGenerating: isLoading,
    selectedConfig,
  } = useCodeGenerator();
  const { history, addToHistory, clearHistory, removeFromHistory, isClient } =
    useHistory();
  const { customConfigs, addCustomConfig, deleteCustomConfig } =
    useCustomConfigs();
  const { errors, addError, removeError, clearErrors } = useErrorHandler();

  const [currentTime, setCurrentTime] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);

  // 合并预设配置和自定义配置
  const allConfigs = [...PRESET_CONFIGS, ...customConfigs];

  // 更新时间
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("zh-CN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100; // 滚动阈值

      // 判断是否滚动超过阈值
      setIsScrolled(currentScrollY > scrollThreshold);

      // 判断滚动方向，控制导航栏显示/隐藏
      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        // 向下滚动且超过阈值，隐藏导航栏
        setShowNavbar(false);
      } else {
        // 向上滚动或未超过阈值，显示导航栏
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 处理使用历史记录
  const handleUseHistoryRecord = (record: HistoryRecord) => {
    const config = allConfigs.find((c) => c.id === record.configId);
    if (config) {
      generateCode(config, addToHistory);
    }
  };

  // 在ConfigSelector组件中也需要传递addToHistory
  const handleAddCustomConfig = (config: Omit<PresetConfig, "id">) => {
    addCustomConfig(config);
    setShowCustomModal(false);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      {/* 错误提示 - 降低层级 */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        {errors.map((error) => (
          <ErrorToast
            key={error.id}
            type={error.type}
            message={error.message}
            details={error.details}
            onClose={() => removeError(error.id)}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* 自定义配置模态框 */}
      <CustomConfigModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSave={handleAddCustomConfig}
        darkMode={darkMode}
      />

      {/* 固定导航栏 */}
      {isScrolled && (
        <div
          className={`navbar-fixed smooth-transition glass-effect ${
            showNavbar ? "" : "navbar-hidden"
          } ${darkMode ? "bg-slate-900/80" : "bg-white/80"}`}
        >
          <nav className="container mx-auto px-6 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold animate-fade-in glow-effect">
                  <span
                    className={`${darkMode ? "text-white" : "text-slate-900"}`}
                  >
                    AutoLogin
                  </span>
                </h1>
                <div
                  className={`text-xs font-mono ${
                    darkMode ? "text-white/70" : "text-slate-600"
                  }`}
                >
                  {currentTime}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isClient && (
                  <HistoryPanel
                    history={history}
                    onClearHistory={clearHistory}
                    onRemoveRecord={removeFromHistory}
                    onUseRecord={handleUseHistoryRecord}
                    darkMode={darkMode}
                  />
                )}
                <button
                  onClick={() => setShowCustomModal(true)}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 hover-lift text-sm ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  ➕ 自定义
                </button>
                <button
                  onClick={toggleDarkMode}
                  className={`p-1.5 rounded-lg transition-all duration-200 hover-lift ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {darkMode ? <SunIcon /> : <MoonIcon />}
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* 主要头部区域 */}
      <div
        className={`relative overflow-hidden smooth-transition ${
          darkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 gradient-animated"
            : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 gradient-animated"
        }`}
      >
        {/* 原始导航栏 */}
        <nav className="relative z-10 container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-white animate-fade-in glow-effect">
                AutoLogin
              </h1>
              <div className="text-sm font-mono text-white/70">
                {currentTime}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isClient && (
                <HistoryPanel
                  history={history}
                  onClearHistory={clearHistory}
                  onRemoveRecord={removeFromHistory}
                  onUseRecord={handleUseHistoryRecord}
                  darkMode={darkMode}
                />
              )}
              <button
                onClick={() => setShowCustomModal(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 hover-lift glass-effect"
              >
                ➕ 自定义
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover-lift glass-effect"
              >
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </nav>

        {/* 标题区域 */}
        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-bounce-in glow-effect">
            登录态注入工具
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in">
            快速、安全、智能的跨浏览器登录状态迁移解决方案
          </p>
        </div>
      </div>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-6 pt-8 relative z-10">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="animate-slide-in-down">
            <ConfigSelector
              configs={allConfigs}
              selectedConfig={selectedConfig}
              onSelect={(config) => generateCode(config, addToHistory)}
              darkMode={darkMode}
              onAddCustom={() => setShowCustomModal(true)}
              onDeleteCustom={deleteCustomConfig}
            />
          </div>

          <div
            className="animate-slide-in-down"
            style={{ animationDelay: "0.1s" }}
          >
            <CodeDisplay
              code={generatedCode}
              isGenerating={isLoading}
              onCopy={() => {
                addError({
                  type: "success",
                  message: "代码已复制到剪贴板",
                });
              }}
              darkMode={darkMode}
            />
          </div>
        </div>
        {/* 使用说明 */}
        <div
          className={`rounded-2xl p-8 backdrop-blur-xl border shadow-2xl mb-16 glass-effect ${
            darkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white/70 border-slate-200"
          }`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center glow-effect">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              使用说明
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                📋 操作步骤
              </h4>
              <ol
                className={`space-y-3 text-sm ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </span>
                  <span>
                    在<strong>已登录</strong>的源浏览器中，选择对应的配置模式
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </span>
                  <span>点击生成代码，系统会自动提取登录数据并生成代码A</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </span>
                  <span>复制代码A，在源浏览器的控制台（F12）中执行</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    4
                  </span>
                  <span>执行后会自动生成代码B并复制到剪贴板</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    5
                  </span>
                  <span>在目标浏览器的控制台中粘贴并执行代码B</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <span>登录状态迁移完成，刷新页面即可看到登录效果</span>
                </li>
              </ol>
            </div>

            <div>
              <h4
                className={`text-lg font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                🔧 配置说明
              </h4>
              <div
                className={`space-y-4 text-sm ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                    🚀 万能模式
                  </div>
                  <div>
                    提取所有localStorage和Cookie数据，适用于复杂登录系统。数据量大但覆盖全面，自动使用三种复制方式确保成功。
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="font-semibold text-green-700 dark:text-green-300 mb-1">
                    🎯 单项模式
                  </div>
                  <div>只提取指定的token、用户信息或会话ID，数据量小</div>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <div className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                    ⚠️ 注意事项
                  </div>
                  <div>
                    确保在HTTPS环境下使用，避免在公共网络中传输敏感数据。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 内联Footer */}
      <footer
        className={`mt-16 text-center py-8 border-t ${
          darkMode
            ? "border-slate-700 text-slate-400"
            : "border-slate-200 text-slate-600"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-sm mb-4">
            自动登录助手 - 让登录状态迁移变得简单高效
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs">
            <span>🔒 本地处理，数据安全</span>
            <span>⚡ 一键迁移，快速便捷</span>
            <span>🌐 跨浏览器兼容</span>
            <span>🛠️ 开源免费</span>
          </div>
          <p className="text-xs mt-4 opacity-75">
            版本 1.0.0 | 最后更新：{new Date().toLocaleDateString("zh-CN")} |{" "}
            <a
              href="https://github.com/zhubincode/autologin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
