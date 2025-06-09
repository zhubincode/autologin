import { useState, useCallback } from "react";
import { PresetConfig } from "../types";

interface UseCodeGeneratorReturn {
  generatedCode: string;
  isGenerating: boolean;
  selectedConfig: PresetConfig | null;
  generateCode: (config: PresetConfig, addToHistory?: (config: PresetConfig, code: string, success: boolean, errorMessage?: string) => void) => Promise<void>;
}

export const useCodeGenerator = (): UseCodeGeneratorReturn => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<PresetConfig | null>(
    null
  );

  const generateCode = useCallback(async (config: PresetConfig, addToHistory?: (config: PresetConfig, code: string, success: boolean, errorMessage?: string) => void) => {
    setIsGenerating(true);
    setSelectedConfig(config);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      let code: string;

      // 增强的剪切板和文件下载逻辑（参考CodeGenerator）
      const clipboardCode = `var f=function(t){try{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(function(){console.log('✅已复制到剪贴板')}).catch(function(){console.warn('剪贴板失败，正在生成文件下载');g(t)})}else{console.warn('浏览器不支持剪贴板API，正在生成文件下载');g(t)}}catch(e){console.warn('剪贴板操作失败:',e.message,'正在生成文件下载');g(t)}};var g=function(t){try{var a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;left:-9999px;top:-9999px;opacity:0';document.body.appendChild(a);a.focus();a.select();var s=document.execCommand('copy');document.body.removeChild(a);if(s){console.log('✅已复制到剪贴板(备用方法)')}else{h(t)}}catch(e){console.warn('备用复制方法失败:',e.message);h(t)}};var h=function(t){try{var blob=new Blob([t],{type:'text/plain'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='autologin_code_'+new Date().getTime()+'.txt';a.style.display='none';document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);console.log('📁已生成文件下载，请查看下载文件夹')}catch(e){console.error('❌文件下载失败:',e.message);console.log('请手动复制以下代码:');console.log(t)}};`;

      // 简化的代码生成逻辑（基于用户原始代码，加上错误处理）
      if (config.source === "all") {
        code = `(function(){try{var d={l:{},c:{},u:location.href};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k)d.l[k]=localStorage.getItem(k)}}catch(e){console.warn('localStorage访问受限:',e.message)}try{document.cookie.split(';').forEach(function(c){var p=c.trim().split('=');if(p[0]&&p[1])d.c[p[0]]=decodeURIComponent(p[1])})}catch(e){console.warn('Cookie访问受限:',e.message)}var b='javascript:(function(){try{var d='+JSON.stringify(d)+';try{Object.keys(d.l).forEach(function(k){localStorage.setItem(k,d.l[k])})}catch(e){console.warn("localStorage写入受限:",e.message)}try{Object.keys(d.c).forEach(function(k){document.cookie=k+"="+encodeURIComponent(d.c[k])+"; path=/; max-age=86400"})}catch(e){console.warn("Cookie写入受限:",e.message)}console.log("✅完成");setTimeout(function(){try{location.href="'+d.u+'"}catch(e){console.log("请手动刷新页面")}},500)}catch(e){console.error("❌注入失败:",e.message)}})()';${clipboardCode}f(b);console.log('✅完成');return '✅完成'}catch(e){console.error('❌执行失败:',e.message);return '❌执行失败: '+e.message}})()`;
      } else {
        code = `(function(){try{var u=location.href,v;try{if("${config.source}"==="localStorage"){v=localStorage.getItem("${config.key}")}else{var c=document.cookie.split(';').find(function(x){return x.trim().startsWith("${config.key}=")});v=c?decodeURIComponent(c.split('=')[1]):null}}catch(e){console.error('数据访问失败:',e.message);return}if(!v){console.error("❌未找到数据");return}var b='javascript:(function(){try{var u="'+u+'",k="${config.key}",v='+JSON.stringify(v)+';try{if("${config.source}"==="localStorage"){localStorage.setItem(k,v)}else{document.cookie=k+"="+encodeURIComponent(v)+"; path=/; max-age=86400"}}catch(e){console.error("数据写入失败:",e.message)}console.log("✅完成");setTimeout(function(){try{location.href=u}catch(e){console.log("请手动刷新页面")}},500)}catch(e){console.error("❌注入失败:",e.message)}})()';${clipboardCode}f(b);return '✅完成'}catch(e){console.error('❌执行失败:',e.message);return '❌执行失败: '+e.message}})()`;
      }

      setGeneratedCode(code);

      // 添加到历史记录
      if (addToHistory) {
        addToHistory(config, code, true);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '代码生成失败';

      // 添加失败记录到历史
      if (addToHistory) {
        addToHistory(config, '', false, errorMessage);
      }

      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generatedCode, isGenerating, selectedConfig, generateCode };
};
