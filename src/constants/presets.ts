import { PresetConfig } from '../types';

export const PRESET_CONFIGS: PresetConfig[] = [
  {
    id: 'all',
    displayName: '万能模式',
    source: 'all',
    icon: '🚀',
    description: '自动提取并注入所有登录数据'
  },
  {
    id: 'token',
    displayName: '认证令牌',
    source: 'localStorage',
    key: 'token',
    icon: '🔑',
    description: 'localStorage中的认证令牌'
  },
  {
    id: 'userInfo',
    displayName: '用户信息',
    source: 'localStorage',
    key: 'userInfo',
    icon: '👤',
    description: '用户信息和配置数据'
  },
  {
    id: 'authToken',
    displayName: 'Bearer令牌',
    source: 'cookie',
    key: 'authToken',
    icon: '🛡️',
    description: 'Bearer认证令牌'
  }
] as const;