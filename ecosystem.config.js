module.exports = {
  apps: [
    {
      name: "next-app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 7434", // 设置端口号7434
      cwd: "/www/wwwroot/autologin.zbcode.cn", // 项目根目录
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
