export class ClipboardManager {
  static getMinifiedCode(): string {
    // 更安全的剪贴板操作代码
    return `var f=function(t){try{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(function(){console.log('✅已复制到剪贴板')}).catch(function(){console.warn('剪贴板API失败，使用备用方法');g(t)})}else{g(t)}}catch(e){console.warn('剪贴板操作失败:',e.message);g(t)}};var g=function(t){try{var a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;left:-9999px;top:-9999px;opacity:0';document.body.appendChild(a);a.focus();a.select();var s=document.execCommand('copy');document.body.removeChild(a);if(s){console.log('✅已复制到剪贴板(备用方法)')}else{console.error('❌复制失败，请手动复制');console.log('代码内容:',t)}}catch(e){console.error('❌复制失败:',e.message);console.log('请手动复制以下代码:');console.log(t)}};`;
  }

  static async copy(text: string): Promise<boolean> {
    try {
      // 检查是否在安全上下文中
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // 备用方法：使用传统的document.execCommand
      return this.fallbackCopy(text);
    } catch (error) {
      console.warn('剪贴板API失败，尝试备用方法:', error);
      return this.fallbackCopy(text);
    }
  }

  private static fallbackCopy(text: string): boolean {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (error) {
      console.error('备用复制方法也失败了:', error);
      // 最后的备用方案：显示代码让用户手动复制
      this.showManualCopyDialog(text);
      return false;
    }
  }

  private static showManualCopyDialog(text: string): void {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 20px;
      z-index: 10000;
      max-width: 80%;
      max-height: 80%;
      overflow: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    dialog.innerHTML = `
      <h3 style="margin-top:0;">⚠️ 需要手动复制</h3>
      <p>由于浏览器安全限制，无法自动复制到剪贴板。请手动复制以下代码：</p>
      <textarea readonly style="width:100%;height:200px;font-family:monospace;font-size:12px;">${text}</textarea>
      <div style="text-align:right;margin-top:10px;">
        <button onclick="this.parentElement.parentElement.remove()" style="padding:8px 16px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;">关闭</button>
      </div>
    `;

    document.body.appendChild(dialog);

    // 自动选中文本
    const textarea = dialog.querySelector('textarea') as HTMLTextAreaElement;
    textarea.focus();
    textarea.select();
  }
}