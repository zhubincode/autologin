"use client";
import { useState, useEffect } from "react";
import { ConfigSelector } from '../components/ConfigSelector';
import { CodeDisplay } from '../components/CodeDisplay';
import { MoonIcon, SunIcon, InfoIcon } from '../components/icons';
import { useCodeGenerator } from '../hooks/useCodeGenerator';
import { useTheme } from '../hooks/useTheme';
import { PRESET_CONFIGS } from '../constants/presets';

export default function Home() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { generatedCode, isGenerating, selectedConfig, generateCode } = useCodeGenerator();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("zh-CN", {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode ? "bg-slate-900" : "bg-gray-50"
    }`}>
      {/* 内联Header */}
      <div className={`relative ${
        darkMode
          ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
      }`}>
        <nav className="relative z-10 container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-white">
                AutoLogin
              </h1>
              <div className="text-sm font-mono text-white/70">
                {currentTime}
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            登录态注入工具
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            快速、安全、智能的跨浏览器登录状态迁移解决方案
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-8">
            <path
              fill={darkMode ? "#0f172a" : "#f9fafb"}
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      <main className="container mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <ConfigSelector
            configs={PRESET_CONFIGS}
            selectedConfig={selectedConfig}
            onSelect={generateCode}
            darkMode={darkMode}
          />

          <CodeDisplay
            code={generatedCode}
            isGenerating={isGenerating}
            onCopy={() => console.log('代码已复制')}
            darkMode={darkMode}
          />
        </div>

        {/* 内联Instructions */}
        <div className={`mt-16 rounded-2xl p-8 backdrop-blur-xl border shadow-2xl ${
          darkMode
            ? "bg-slate-800/50 border-slate-700"
            : "bg-white/70 border-slate-200"
        }`}>
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <InfoIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}>使用说明</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}>📋 操作步骤</h4>
              <ol className={`space-y-3 text-sm ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <span>在<strong>已登录</strong>的源浏览器中，选择对应的配置模式</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <span>点击生成代码，系统会自动提取登录数据并生成代码A</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <span>复制代码A，在源浏览器的控制台（F12）中执行</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                  <span>执行后会自动生成代码B并复制到剪贴板</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">5</span>
                  <span>在目标浏览器的控制台中粘贴并执行代码B</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                  <span>登录状态迁移完成，刷新页面即可看到登录效果</span>
                </li>
              </ol>
            </div>

            <div>
              <h4 className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}>🔧 配置说明</h4>
              <div className={`space-y-4 text-sm ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}>
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">🚀 万能模式</div>
                  <div>提取所有localStorage和Cookie数据，适用于复杂登录系统。数据量大但覆盖全面，自动使用三种复制方式确保成功。</div>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="font-semibold text-green-700 dark:text-green-300 mb-1">🎯 单项模式</div>
                  <div>只提取指定的token、用户信息或会话ID，数据量小</div>

                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <div className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">⚠️ 注意事项</div>
                  <div>确保在HTTPS环境下使用，避免在公共网络中传输敏感数据。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 内联Footer */}
      <footer className={`mt-16 text-center py-8 border-t ${
        darkMode ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-600"
      }`}>
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
              版本 1.0.0 | 最后更新：{new Date().toLocaleDateString('zh-CN')} | <a href="https://github.com/zhubincode/autologin" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
            </p>
        </div>
      </footer>
    </div>
  );
}
