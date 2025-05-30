module.exports = {
  apps: [
    {
      name: "next-app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 7433", // 设置端口号7433
      cwd: "/www/wwwroot/your-nextjs-project", // 项目根目录
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
