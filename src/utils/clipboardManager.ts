export class ClipboardManager {
  static getMinifiedCode(): string {
    return `var f=function(t){if(navigator.clipboard){navigator.clipboard.writeText(t).catch(function(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.left='-9999px';document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a)})}else{var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.left='-9999px';document.body.appendChild(a);a.select();document.execCommand('copy');document.body.removeChild(a)}};`;
  }

  static async copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  }
}