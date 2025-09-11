# 🌐 CloudStudio 部署指南

## 📋 CloudStudio 环境部署步骤

### 1. 准备项目文件包
首先在本地打包项目文件：

```bash
# 创建部署包（排除node_modules）
tar -czf cityu-ai-knowledge-weaver.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=build \
  src/ public/ package.json package-lock.json \
  README.md DEPLOYMENT.md .gitignore
```

### 2. 在CloudStudio中创建项目

1. **访问CloudStudio**
   - 打开 https://cloudstudio.net/a/29688726589857792?channel=share&sharetype=URL
   - 登录腾讯云账号

2. **创建新工作空间**
   ```
   项目名称: cityu-ai-knowledge-weaver
   模板选择: React 模板 或 空白模板
   配置: 标准配置即可
   ```

3. **等待环境初始化**
   - CloudStudio会自动分配云端开发环境
   - 通常需要1-2分钟完成初始化

### 3. 上传项目文件

#### 方法一：直接上传（推荐）
1. 在CloudStudio文件管理器中，删除默认文件
2. 将以下文件逐个上传或复制粘贴：

**📄 package.json**
```json
{
  "name": "cityu-ai-knowledge-weaver",
  "version": "1.0.0",
  "description": "CityU AI Knowledge Weaver - 智能语音转写系统",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "antd": "^5.12.8",
    "file-saver": "^2.0.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^8.0.7",
    "react-scripts": "5.0.1",
    "react-vis-network-graph": "^0.9.0",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

**📄 .gitignore**
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
```

#### 方法二：Git克隆（如果已推送到仓库）
```bash
# 在CloudStudio终端中执行
git clone https://github.com/your-username/cityu-ai-knowledge-weaver.git
cd cityu-ai-knowledge-weaver
```

### 4. 创建项目结构

在CloudStudio中创建以下目录结构：
```
cityu-ai-knowledge-weaver/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   └── Transcription.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

### 5. 安装依赖并启动

在CloudStudio终端中执行：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 6. CloudStudio特殊配置

#### 端口配置
CloudStudio默认会自动处理端口映射，但如果需要指定：

```bash
# 指定端口启动
PORT=3000 npm start
```

#### 环境变量配置
在CloudStudio中创建 `.env` 文件：
```env
# 禁用自动打开浏览器
BROWSER=none

# 设置公共URL（CloudStudio会自动处理）
PUBLIC_URL=/

# API配置
REACT_APP_NER_API_ENDPOINT=https://your-ner-api-endpoint.com
REACT_APP_GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

### 7. 访问应用

1. **自动预览**
   - CloudStudio会自动生成预览URL
   - 通常格式为：`https://xxx-3000.cloudstudio.net`

2. **手动访问**
   - 在CloudStudio界面找到"预览"或"端口"选项
   - 点击3000端口对应的访问链接

### 8. 部署到生产环境

#### 构建生产版本
```bash
# 构建项目
npm run build

# 构建完成后，build文件夹包含生产版本
```

#### 部署选项

**选项1：CloudStudio静态托管**
```bash
# 如果CloudStudio支持静态托管
# 将build文件夹内容部署到静态服务器
```

**选项2：腾讯云COS**
```bash
# 安装腾讯云CLI工具
npm install -g @tencent-cloud/cli

# 配置并上传到COS
coscli config init
coscli cp -r build/ cos://your-bucket-name/
```

**选项3：Vercel部署**
```bash
# 安装Vercel CLI
npm install -g vercel

# 部署到Vercel
vercel --prod
```

### 9. 故障排除

#### 常见问题

1. **依赖安装失败**
   ```bash
   # 清理缓存重新安装
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

2. **端口占用**
   ```bash
   # 查看端口使用情况
   netstat -tulpn | grep :3000
   
   # 杀死占用进程
   kill -9 $(lsof -t -i:3000)
   ```

3. **权限问题**
   ```bash
   # 修复权限
   sudo chown -R $(whoami) node_modules
   ```

4. **内存不足**
   ```bash
   # 增加Node.js内存限制
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm start
   ```

### 10. CloudStudio优化建议

#### 性能优化
```bash
# 使用yarn替代npm（更快）
npm install -g yarn
yarn install
yarn start
```

#### 开发体验优化
```json
// 在package.json中添加
{
  "scripts": {
    "dev": "BROWSER=none react-scripts start",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}
```

### 11. 监控和调试

#### 实时日志
```bash
# 查看应用日志
npm start 2>&1 | tee app.log

# 监控错误日志
tail -f app.log | grep ERROR
```

#### 性能监控
在CloudStudio中可以使用浏览器开发者工具进行性能分析。

---

## 🚀 快速部署命令

```bash
# 一键部署脚本
#!/bin/bash
echo "🚀 开始部署 CityU AI Knowledge Weaver 到 CloudStudio..."

# 安装依赖
echo "📦 安装依赖..."
npm install

# 启动应用
echo "🎯 启动应用..."
npm start

echo "✅ 部署完成！请在CloudStudio预览窗口中查看应用。"
```

## 📞 技术支持

如果在CloudStudio部署过程中遇到问题：

1. 检查CloudStudio控制台日志
2. 确认网络连接状态
3. 验证依赖版本兼容性
4. 联系CloudStudio技术支持

**🌐 CloudStudio部署完成后，你就可以在云端随时随地使用CityU AI Knowledge Weaver了！**