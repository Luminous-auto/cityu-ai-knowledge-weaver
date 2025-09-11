#!/bin/bash

# CityU AI Knowledge Weaver - CloudStudio 一键部署脚本
# 使用方法：在CloudStudio终端中运行 bash cloudstudio-setup.sh

echo "🚀 开始部署 CityU AI Knowledge Weaver 到 CloudStudio..."
echo "=================================================="

# 检查Node.js环境
echo "🔍 检查环境..."
node --version
npm --version

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 检查依赖安装结果
if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功！"
else
    echo "❌ 依赖安装失败，尝试清理缓存..."
    npm cache clean --force
    rm -rf node_modules package-lock.json
    npm install
fi

# 设置环境变量
echo "⚙️ 配置环境变量..."
export BROWSER=none
export PORT=3000

# 启动开发服务器
echo "🎯 启动应用服务器..."
echo "应用将在 http://localhost:3000 启动"
echo "CloudStudio会自动生成外部访问链接"
echo "=================================================="

# 启动应用
npm start