# 自动登录助手 - 部署指南

本文档详细说明如何在生产环境中部署自动登录助手项目。

## 环境要求

- **Node.js**: >= 16.0.0 < 18.0.0
- **pnpm**: >= 7.0.0
- **PM2**: 用于进程管理
- **服务器**: Linux/Ubuntu 推荐

## 部署步骤

### 1. 服务器准备

```bash
# 安装 Node.js 16
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm@7.9.2

# 安装 PM2
npm install -g pm2
```

### 2. 项目部署

```bash
# 克隆项目到服务器
git clone <your-repo-url> /www/wwwroot/autologin.zbcode.cn
cd /www/wwwroot/autologin.zbcode.cn

# 安装依赖
pnpm install

# 构建项目
pnpm build
```

### 3. PM2 配置

```bash
module.exports = {
  apps: [
    {
      name: "next-app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 7433", // 端口号 7433
      cwd: "/www/wwwroot/autologin.zbcode.cn", // 项目根目录
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

### 4. 启动应用

```bash
# 使用 PM2 启动应用
pm2 start ecosystem.config.js

# 查看应用状态
pm2 status

# 查看日志
pm2 logs next-app

# 重启应用
pm2 restart next-app

# 停止应用
pm2 stop next-app
```

### 5. 设置开机自启

```bash
# 保存当前 PM2 进程列表
pm2 save

# 生成开机自启脚本
pm2 startup

# 按照提示执行生成的命令（通常需要 sudo 权限）
```

### 反向代理配置

Nginx 配置示例

```nginx
server {
    listen 80;
    server_name autologin.zbcode.cn;

    location / {
        proxy_pass http://localhost:7433;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache 配置示例

```apache
<VirtualHost *:80>
    ServerName autologin.zbcode.cn

    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass / http://localhost:7433/
    ProxyPassReverse / http://localhost:7433/

    ProxyPass /ws ws://localhost:7433/ws
    ProxyPassReverse /ws ws://localhost:7433/ws
</VirtualHost>
```

### 常用 PM2 命令

```bash
# 查看所有进程
pm2 list

# 查看特定进程详情
pm2 show next-app

# 监控进程
pm2 monit

# 重载应用（零停机时间）
pm2 reload next-app

# 删除进程
pm2 delete next-app

# 查看实时日志
pm2 logs next-app --lines 100

```

## 更新部署

```
# 进入项目目录
cd /www/wwwroot/autologin.zbcode.cn

# 拉取最新代码
git pull origin main

# 安装新依赖（如果有）
pnpm install

# 重新构建
pnpm build

# 重启应用
pm2 restart next-app
```

## 监控和日志

### 日志文件位置

- PM2 日志: ~/.pm2/logs/
- 应用日志: ~/.pm2/logs/next-app-out.log
- 错误日志: ~/.pm2/logs/next-app-error.log

### 日志轮转配置

```
# 安装 PM2 日志轮转模块
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## 故障排除

### 常见问题

1. 端口被占用

   ```
   # 查看端口占用
   lsof -i :7433
   # 或
   netstat -tulpn | grep 7433
   ```

2. 权限问题

   ```
   # 确保项目目录权限正确
   sudo chown -R $USER:$USER /www/wwwroot/
   autologin.zbcode.cn
   ```

3. 内存不足

   ```
   # 查看内存使用
   free -h
   # 查看 PM2 进程内存使用
   pm2 monit
   ```

### 性能优化

```
# 设置 PM2 集群模式（多核 CPU）
pm2 start ecosystem.config.js --instances max

# 或在配置文件中设置
# instances: 'max' 或具体数字
```

## 安全建议

1. 防火墙配置

   ```
   # 只开放必要端口
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

2. 定期更新

   ```
   # 定期更新系统和依赖
   sudo apt update && sudo apt upgrade
   npm update -g pm2
   ```

3. 备份策略

   - 定期备份项目文件
   - 备份 PM2 配置: pm2 save
   - 数据库备份（如果有）

## 联系支持

如果在部署过程中遇到问题，请：

1. 检查日志文件
2. 确认环境要求
3. 参考故障排除部分
4. 联系技术支持
