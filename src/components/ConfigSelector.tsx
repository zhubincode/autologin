import { PresetConfig } from '../types';

interface ConfigSelectorProps {
  configs: PresetConfig[];
  selectedConfig: PresetConfig | null;
  onSelect: (config: PresetConfig) => void;
  darkMode: boolean;
}

export const ConfigSelector = ({ configs, selectedConfig, onSelect, darkMode }: ConfigSelectorProps) => {
  return (
    <div className={`rounded-2xl p-8 backdrop-blur-xl border shadow-2xl overflow-auto ${
      darkMode
        ? "bg-slate-800/50 border-slate-700"
        : "bg-white/70 border-slate-200"
    }`} style={{maxHeight: '800px'}}>
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </div>
        <h3 className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-slate-900"
        }`}>配置选择</h3>
      </div>

      <div className="space-y-4">
        {configs.map((config) => (
          <button
            key={config.id}
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
                <h4 className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}>
                  {config.displayName}
                </h4>
                <p className={`text-sm ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}>
                  {config.description}
                </p>
                {config.key && (
                  <div className={`mt-2 text-xs font-mono px-2 py-1 rounded ${
                    darkMode ? "bg-slate-600 text-slate-300" : "bg-slate-100 text-slate-600"
                  }`}>
                    {config.source}: {config.key}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};