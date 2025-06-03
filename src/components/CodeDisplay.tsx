import { CodeIcon, DocumentIcon } from './icons';
import { CopyButton } from './CopyButton';

interface CodeDisplayProps {
  code: string;
  isGenerating: boolean;
  onCopy: () => void;
  darkMode: boolean;
}

export const CodeDisplay = ({ code, isGenerating, onCopy, darkMode }: CodeDisplayProps) => {
  return (
    <div className={`rounded-2xl p-8 backdrop-blur-xl border shadow-2xl ${
      darkMode
        ? "bg-slate-800/50 border-slate-700"
        : "bg-white/70 border-slate-200"
    }`} style={{maxHeight: '800px'}}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <CodeIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}>生成的代码</h3>
        </div>

        {code && (
          <CopyButton code={code} onCopy={onCopy} darkMode={darkMode} />
        )}
      </div>

      {isGenerating ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`text-lg font-medium ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}>正在生成代码...</p>
          </div>
        </div>
      ) : code ? (
        <div className={`rounded-xl border overflow-hidden ${
          darkMode ? "border-slate-600" : "border-slate-200"
        }`}>
          <div className={`px-4 py-3 border-b flex items-center justify-between ${
            darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className={`ml-4 text-sm font-medium ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}>代码A - 在源浏览器执行</span>
            </div>
            <div className={`text-xs ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}>
              JavaScript
            </div>
          </div>
          <div className={`p-4 font-mono text-sm overflow-auto ${
            darkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-800"
          }`} style={{maxHeight: '600px'}}>
            <pre className="whitespace-pre-wrap break-all">{code}</pre>
          </div>
        </div>
      ) : (
        <div className={`text-center py-20 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}>
          <DocumentIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">请选择一个配置模式</p>
          <p className="text-sm">选择左侧的配置选项来生成对应的代码</p>
        </div>
      )}
    </div>
  );
};