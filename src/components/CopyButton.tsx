import { useState } from 'react';
import { CopyIcon } from './icons';

interface CopyButtonProps {
  code: string;
  onCopy: () => void;
  darkMode: boolean;
}

export const CopyButton = ({ code, onCopy, darkMode }: CopyButtonProps) => {
  const [copyStatus, setCopyStatus] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus('✅ 复制成功');
      onCopy();
    } catch (err) {
      setCopyStatus('❌ 复制失败');
    }

    setTimeout(() => setCopyStatus(''), 3000);
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleCopy}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2 hover:scale-105 shadow-lg"
      >
        <CopyIcon />
        <span>复制代码</span>
      </button>

      {copyStatus && (
        <div className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
          copyStatus.includes("✅")
            ? darkMode
              ? "bg-green-900/30 text-green-400 border border-green-800"
              : "bg-green-50 text-green-700 border border-green-200"
            : darkMode
              ? "bg-red-900/30 text-red-400 border border-red-800"
              : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {copyStatus}
        </div>
      )}
    </div>
  );
};