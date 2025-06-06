import { PresetConfig } from '../types';
import { ClipboardManager } from './clipboardManager';

interface CodeTemplate {
  extractor: string;
  injector: string;
}

export class CodeGenerator {
  private static readonly TEMPLATES: Record<string, CodeTemplate> = {
    all: {
      extractor: `var d={l:{},c:{},u:location.href};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k)d.l[k]=localStorage.getItem(k)}document.cookie.split(';').forEach(function(c){var p=c.trim().split('=');if(p[0]&&p[1])d.c[p[0]]=decodeURIComponent(p[1])})`,
      injector: `Object.keys(d.l).forEach(function(k){localStorage.setItem(k,d.l[k])});Object.keys(d.c).forEach(function(k){document.cookie=k+"="+encodeURIComponent(d.c[k])+"; path=/; max-age=86400"})`
    },
    single: {
      extractor: `var u=location.href,v;if("{source}"==="localStorage"){v=localStorage.getItem("{key}")}else{var c=document.cookie.split(';').find(function(x){return x.trim().startsWith("{key}=")});v=c?decodeURIComponent(c.split('=')[1]):null}if(!v){console.error("❌未找到");return}`,
      injector: `if("{source}"==="localStorage"){localStorage.setItem(k,v)}else{document.cookie=k+"="+encodeURIComponent(v)+"; path=/; max-age=86400"}`
    }
  };

  static generate(config: PresetConfig): string {
    const isUniversal = config.source === 'all';
    const template = isUniversal ? this.TEMPLATES.all : this.TEMPLATES.single;

    const extractor = isUniversal
      ? template.extractor
      : template.extractor.replace(/\{source\}/g, config.source).replace(/\{key\}/g, config.key || '');

    const injector = isUniversal
      ? template.injector
      : template.injector.replace(/\{source\}/g, config.source);

    const dataVar = isUniversal ? 'd' : `{u:"'+u+'",k:"${config.key}",v:'+JSON.stringify(v)+'}`;
    const clipboardCode = ClipboardManager.getMinifiedCode();

    return `(function(){${extractor};var b='javascript:(function(){var ${dataVar};${injector};console.log("✅完成");setTimeout(function(){location.href="'+${isUniversal ? 'd.u' : 'u'}+'"},500)})()';${clipboardCode}f(b);return '✅完成'})()`;
  }
}