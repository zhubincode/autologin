import { useState, useCallback } from 'react';
import { PresetConfig } from '../types';

interface UseCodeGeneratorReturn {
  generatedCode: string;
  isGenerating: boolean;
  selectedConfig: PresetConfig | null;
  generateCode: (config: PresetConfig) => Promise<void>;
}

export const useCodeGenerator = (): UseCodeGeneratorReturn => {
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<PresetConfig | null>(null);

  const generateCode = useCallback(async (config: PresetConfig) => {
    setIsGenerating(true);
    setSelectedConfig(config);

    await new Promise(resolve => setTimeout(resolve, 300));

    // 简化的代码生成逻辑
    if (config.source === "all") {
      const code = `(function(){var d={l:{},c:{},u:location.href};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k)d.l[k]=localStorage.getItem(k)}document.cookie.split(';').forEach(function(c){var p=c.trim().split('=');if(p[0]&&p[1])d.c[p[0]]=decodeURIComponent(p[1])});var b='javascript:(function(){var d='+JSON.stringify(d)+';Object.keys(d.l).forEach(function(k){localStorage.setItem(k,d.l[k])});Object.keys(d.c).forEach(function(k){document.cookie=k+"="+encodeURIComponent(d.c[k])+"; path=/; max-age=86400"});console.log("✅完成");setTimeout(function(){location.href="'+d.u+'"},500)})()';var f=function(t){if(navigator.clipboard){navigator.clipboard.writeText(t).catch(function(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.left='-9999px';document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a)})}else{var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.left='-9999px';document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a)}};f(b);console.log('✅完成');return '✅完成'})()`;
      setGeneratedCode(code);
    } else {
      const code = `(function(){var u=location.href,v;if("${config.source}"==="localStorage"){v=localStorage.getItem("${config.key}")}else{var c=document.cookie.split(';').find(function(x){return x.trim().startsWith("${config.key}=")});v=c?decodeURIComponent(c.split('=')[1]):null}if(!v){console.error("❌未找到");return}var b='javascript:(function(){var u="'+u+'",k="${config.key}",v='+JSON.stringify(v)+';if("${config.source}"==="localStorage"){localStorage.setItem(k,v)}else{document.cookie=k+"="+encodeURIComponent(v)+"; path=/; max-age=86400"}console.log("✅完成");setTimeout(function(){location.href=u},500)})()';var f=function(t){if(navigator.clipboard){navigator.clipboard.writeText(t).catch(function(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.left='-9999px';document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a)})}else{var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.left='-9999px';document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a)}};f(b);return '✅完成'})()`;
      setGeneratedCode(code);
    }

    setIsGenerating(false);
  }, []);

  return { generatedCode, isGenerating, selectedConfig, generateCode };
};