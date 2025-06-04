"use client";
import { useState, useEffect } from "react";
import { ConfigSelector } from '../components/ConfigSelector';
import { CodeDisplay } from '../components/CodeDisplay';
import { MoonIcon, SunIcon, InfoIcon } from '../components/icons';
import { PresetConfig } from '../types';

export default function Home() {
  const [selectedConfig, setSelectedConfig] = useState<PresetConfig | null>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 重新设计的预设配置
  const presetConfigs: PresetConfig[] = [
    {
      id: "all",
      displayName: "万能模式",
      source: "all",
      icon: "🚀",
      description: "自动提取并注入所有登录数据"
    },
    {
      id: "token",
      displayName: "认证令牌",
      source: "localStorage",
      key: "token",
      icon: "🔑",
      description: "localStorage中的认证令牌"
    },
    {
      id: "userInfo",
      displayName: "用户信息",
      source: "localStorage",
      key: "userInfo",
      icon: "👤",
      description: "用户信息和配置数据"
    },
    {
      id: "authToken",
      displayName: "Bearer令牌",
      source: "cookie",
      key: "authToken",
      icon: "🛡️",
      description: "Bearer认证令牌"
    },
  ];

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("zh-CN", {
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

  // 提取的三种复制方式公共函数
  const copyCodeWithMultipleMethods = (codeB: string, successMessage: string = '✅ 代码B已复制到剪贴板') => {
    // 方式1：现代浏览器 navigator.clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeB).then(() => {
        console.log(successMessage + ' (方式1)');
      }).catch(() => {
        console.log('方式1复制失败，尝试方式2');
        tryMethod2();
      });
    } else {
      tryMethod2();
    }

    function tryMethod2() {
      // 方式2：创建临时文本域
      try {
        const textArea = document.createElement('textarea');
        textArea.value = codeB;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          console.log(successMessage + ' (方式2)');
        } else {
          tryMethod3();
        }
      } catch (err) {
        tryMethod3();
      }
    }

    function tryMethod3() {
      // 方式3：手动选择复制
      console.log('=== 自动复制失败，请手动复制下方代码B ===');
      console.log('%c点击这里全选复制:', 'color: red; font-size: 16px; font-weight: bold;');

      // 创建可选择的div
      const div = document.createElement('div');
      div.style.position = 'fixed';
      div.style.top = '50px';
      div.style.left = '50px';
      div.style.background = 'white';
      div.style.border = '2px solid red';
      div.style.padding = '20px';
      div.style.zIndex = '9999';
      div.style.maxWidth = '80%';
      div.style.maxHeight = '300px';
      div.style.overflow = 'auto';
      div.style.fontFamily = 'monospace';
      div.style.fontSize = '12px';
      div.innerHTML = '<h3>请全选复制下方代码B:</h3><pre style="user-select: all; background: #f0f0f0; padding: 10px;">' + codeB + '</pre><button onclick="this.parentElement.remove()">关闭</button>';
      document.body.appendChild(div);

      // 10秒后自动关闭
      setTimeout(() => {
        if (div.parentElement) {
          div.remove();
        }
      }, 10000);
    }
  };

  const generateCode = async (config: PresetConfig) => {
    setIsGenerating(true);
    setSelectedConfig(config);

    // 添加生成动画延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    if (config.source === "all") {
      // 万能模式：使用公共复制函数
      const code = `(function(){
        var d={l:{},c:{},u:location.href};
        for(var i=0;i<localStorage.length;i++){
          var k=localStorage.key(i);
          if(k)d.l[k]=localStorage.getItem(k)
        }
        document.cookie.split(';').forEach(function(c){
          var p=c.trim().split('=');
          if(p[0]&&p[1])d.c[p[0]]=decodeURIComponent(p[1])
        });

        var codeB = 'javascript:(function(){var d=' + JSON.stringify(d) + ';Object.keys(d.l).forEach(function(k){localStorage.setItem(k,d.l[k])});Object.keys(d.c).forEach(function(k){document.cookie=k+"="+encodeURIComponent(d.c[k])+"; path=/; max-age=86400"});console.log("✅登录态注入完成");setTimeout(function(){location.href="' + d.u + '"},500)})()'

        // 使用三种复制方式
        ${copyCodeWithMultipleMethods.toString()}
        copyCodeWithMultipleMethods(codeB, '✅ 代码B已复制到剪贴板');

        console.log('✅ 数据收集完成');
        return '✅ 数据收集完成，代码B复制处理中...'
      })()`;

      setGeneratedCode(code);
    } else {
      // 单一数据模式：也使用公共复制函数
      const code = `(function(){
        var u=location.href,v;
        if("${config.source}"==="localStorage"){
          v=localStorage.getItem("${config.key}")
        }else{
          var c=document.cookie.split(';').find(function(x){return x.trim().startsWith("${config.key}=")});
          v=c?decodeURIComponent(c.split('=')[1]):null
        }
        if(!v){
          console.error("❌${config.key} 未找到");
          return
        }
        var codeB='javascript:(function(){var u="'+u+'",k="${config.key}",v='+JSON.stringify(v)+';if("${config.source}"==="localStorage"){localStorage.setItem(k,v)}else{document.cookie=k+"="+encodeURIComponent(v)+"; path=/; max-age=86400"}console.log("✅已注入:",k);setTimeout(function(){location.href=u},500)})()';

        // 使用三种复制方式
        ${copyCodeWithMultipleMethods.toString()}
        copyCodeWithMultipleMethods(codeB, '✅ 代码B已复制到剪贴板');

        return '✅ 数据收集完成，代码B已处理';
      })()`;

      setGeneratedCode(code);
    }

    setIsGenerating(false);
  };

  const handleCopy = () => {
    // 复制成功的回调处理
    console.log('代码已复制');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode
        ? "bg-slate-900"
        : "bg-gray-50"
    }`}>
      {/* 贯穿式渐变顶部 */}
      <div className={`relative ${
        darkMode
          ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
      }`}>
        {/* 顶部导航 */}
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

        {/* 紧凑的Hero区域 */}
        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            登录态注入工具
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            快速、安全、智能的跨浏览器登录状态迁移解决方案
          </p>
        </div>

        {/* 渐变阴影过渡 */}
        <div className={`absolute bottom-0 left-0 right-0 h-20 ${
          darkMode
            ? "bg-gradient-to-b from-transparent to-slate-900/50"
            : "bg-gradient-to-b from-transparent to-gray-50/50"
        }`}></div>

        {/* 底部装饰波浪 */}
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
        {/* 主要内容区域 - 添加柔和阴影 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className={`rounded-2xl p-8 backdrop-blur-sm border shadow-xl ${
            darkMode
              ? "bg-slate-800/90 border-slate-700/50 shadow-slate-900/50"
              : "bg-white/90 border-slate-200/50 shadow-slate-900/10"
          }`}>
            <ConfigSelector
              configs={presetConfigs}
              selectedConfig={selectedConfig}
              onSelect={generateCode}
              darkMode={darkMode}
            />
          </div>

          <div className={`rounded-2xl p-8 backdrop-blur-sm border shadow-xl ${
            darkMode
              ? "bg-slate-800/90 border-slate-700/50 shadow-slate-900/50"
              : "bg-white/90 border-slate-200/50 shadow-slate-900/10"
          }`}>
            <CodeDisplay
              code={generatedCode}
              isGenerating={isGenerating}
              onCopy={handleCopy}
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* 使用说明区域 */}
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
                  <div>只提取指定的token、用户信息或会话ID，数据量小，适用于简单登录系统。</div>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <div className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">⚠️ 注意事项</div>
                  <div>确保在HTTPS环境下使用，避免在公共网络中传输敏感数据。</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 页脚 */}
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
      </main>
    </div>
  );
}
