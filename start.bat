@echo off
echo 正在启动AI图表生成器...
echo.
echo 请确保已经：
echo 1. 安装了Node.js (版本 >= 16.0.0)
echo 2. 复制了env.example为.env并配置了API密钥
echo.
echo 正在安装依赖...
npm install
echo.
echo 依赖安装完成，正在启动开发服务器...
npm run dev
pause
