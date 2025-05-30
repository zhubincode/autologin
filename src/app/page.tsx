'use client';

import { useState, useEffect } from 'react';

interface ConfigItem {
  id: string;
  source: 'localStorage' | 'cookie';
  key: string;
  displayName: string;
}

const presetConfigs: ConfigItem[] = [
  {
    id: '1',
    source: 'localStorage',
    key: 'lifeData',
    displayName: 'portal登录态',
  },
  {
    id: '2',
    source: 'localStorage',
    key: 'token',
    displayName: 'admin 登录态'
  }
];

export default function Home() {
  const [currentTime, setCurrentTime] = useState('');
  const [selectedConfig, setSelectedConfig] = useState<ConfigItem | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // 检测系统暗色模式
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('zh-CN'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateCode = (config: ConfigItem) => {
    // 极简化代码A - 确保可执行性
    const codeA = `(function(){var s="${config.source}",k="${config.key}",d=s==="localStorage"?localStorage.getItem(k):document.cookie.split("; ").find(r=>r.startsWith(k+"="))?.split("=")[1];if(!d){console.log("未找到数据");return}try{d=JSON.parse(d)}catch(e){}var u=location.href;var c="(function(){"+(s==="localStorage"?"localStorage.setItem('"+k+"','"+JSON.stringify(d)+"')":"document.cookie='"+k+"="+encodeURIComponent(JSON.stringify(d))+";path=/'")+";location.href='"+u+"';})();";console.log("生成的注入代码：");console.log(c);})();`;

    setSelectedConfig(config);
    setGeneratedCode(codeA);

    // 不再尝试直接复制到系统剪贴板
    setCopyStatus('代码已生成，请手动复制');
    setTimeout(() => setCopyStatus(''), 3000);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(generatedCode).then(() => {
        setCopyStatus('已尝试复制到剪贴板');
        setTimeout(() => setCopyStatus(''), 3000);
      }).catch(() => {
        setCopyStatus('复制失败，请手动复制');
        setTimeout(() => setCopyStatus(''), 3000);
      });
    } catch (e) {
      setCopyStatus('复制失败，请手动复制');
      setTimeout(() => setCopyStatus(''), 3000);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 text-gray-900'}`}>
      {/* 顶部导航栏 */}
      <nav className={`px-6 py-4 ${darkMode ? 'bg-gray-900/70' : 'bg-white/70'} backdrop-blur-md shadow-md sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">登录态注入工具</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{currentTime}</div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-200 text-gray-700'} transition-colors`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 - 使用flex-grow确保它占据所有可用空间 */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧配置选择 */}
          <div className={`lg:col-span-1 ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-md rounded-2xl shadow-xl p-6 h-fit`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              选择配置
            </h2>
            <div className="space-y-4">
              {presetConfigs.map((config) => (
                <button
                  key={config.id}
                  onClick={() => generateCode(config)}
                  className={`w-full p-5 rounded-xl border-2 transition-all transform hover:-translate-y-1 ${selectedConfig?.id === config.id ?
                    `${darkMode ? 'border-indigo-500 bg-indigo-900/30' : 'border-indigo-500 bg-indigo-50'} shadow-lg shadow-indigo-500/20` :
                    `${darkMode ? 'border-gray-700 hover:border-indigo-400' : 'border-gray-200 hover:border-indigo-300'} hover:shadow-md`
                  }`}
                >
                  <div className="font-semibold text-lg mb-2">{config.displayName}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${config.source === 'localStorage' ?
                      (darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800') :
                      (darkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-800')}`}>
                      {config.source}
                    </span>
                    <span>{config.key}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <h3 className="font-medium mb-2 flex items-center gap-1">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                使用说明
              </h3>
              <ol className={`text-sm space-y-2 list-decimal list-inside ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>选择一个配置生成代码A</li>
                <li>复制代码A到目标页面的控制台执行</li>
                <li>控制台会输出代码B</li>
                <li>复制代码B到任意浏览器控制台执行</li>
                <li>执行后会自动注入登录态并跳转到原页面</li>
              </ol>
            </div>
          </div>

          {/* 右侧代码展示 */}
          <div className={`lg:col-span-2 ${generatedCode ? 'block' : 'hidden lg:block'}`}>
            {generatedCode ? (
              <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-md rounded-2xl shadow-xl p-6`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    生成的代码A
                  </h2>
                  {copyStatus && (
                    <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'} animate-pulse`}>
                      {copyStatus}
                    </span>
                  )}
                </div>
                <div className="relative group">
                  <pre className={`${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-gray-100 p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed max-h-[500px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900`}>
                    <code>{generatedCode}</code>
                  </pre>
                  <button
                    onClick={copyToClipboard}
                    className={`absolute top-4 right-4 px-4 py-2 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${darkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
                  >
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      复制代码A
                    </span>
                  </button>
                </div>
                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} border ${darkMode ? 'border-indigo-800' : 'border-indigo-100'}`}>
                  <h3 className="font-medium mb-2 flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    使用步骤
                  </h3>
                  <ul className={`text-sm space-y-2 list-disc list-inside ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    <li>复制上方的<strong>代码A</strong></li>
                    <li>在<strong>目标页面</strong>的浏览器控制台中粘贴并执行</li>
                    <li>控制台会输出<strong>代码B</strong></li>
                    <li>复制<strong>代码B</strong>到任意浏览器控制台执行</li>
                    <li>执行成功后会自动注入登录态并跳转到原页面</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className={`h-full flex items-center justify-center ${darkMode ? 'bg-gray-800/30' : 'bg-white/50'} backdrop-blur-sm rounded-2xl border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-12`}>
                <div className="text-center">
                  <svg className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <p className={`text-xl font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>请从左侧选择一个配置</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 页脚 - 使用mt-auto确保它始终在底部 */}
      <footer className={`mt-auto py-6 ${darkMode ? 'bg-gray-900/70' : 'bg-white/70'} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>登录态注入工具 &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
