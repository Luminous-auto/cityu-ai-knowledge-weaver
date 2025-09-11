# 🚀 部署指南

## CNB.cool 部署步骤

### 1. 创建CNB.cool仓库
1. 访问 [CNB.cool](https://cnb.cool)
2. 点击 "New Repository"
3. 仓库名称：`cityu-ai-knowledge-weaver`
4. 描述：`CityU AI Knowledge Weaver - 智能语音转写系统`
5. 设置为 Public
6. 点击 "Create Repository"

### 2. 推送代码到CNB.cool
```bash
# 添加远程仓库
git remote add origin https://cnb.cool/[your-username]/cityu-ai-knowledge-weaver.git

# 推送代码
git branch -M main
git push -u origin main
```

### 3. 配置部署
```bash
# 构建生产版本
npm run build

# 部署到GitHub Pages (如果支持)
npm install -g gh-pages
gh-pages -d build
```

## 环境变量配置

创建 `.env` 文件：
```env
# Google Translate API (可选)
REACT_APP_GOOGLE_TRANSLATE_API_KEY=your_api_key_here

# NER API 端点
REACT_APP_NER_API_ENDPOINT=https://your-ner-api-endpoint.com

# Wikipedia API (默认使用公共API)
REACT_APP_WIKIPEDIA_API_BASE=https://en.wikipedia.org/api/rest_v1
```

## 生产环境优化

### 1. 构建优化
```bash
# 安装构建依赖
npm install --production

# 构建优化版本
npm run build

# 分析包大小
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

### 2. 性能优化
- 启用 Service Worker
- 配置 CDN 加速
- 启用 Gzip 压缩
- 优化图片资源

### 3. 安全配置
- 配置 HTTPS
- 设置 CSP 头
- 启用 CORS 保护
- API 密钥保护

## 监控和维护

### 1. 错误监控
```javascript
// 添加全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // 发送到监控服务
});
```

### 2. 性能监控
```javascript
// Web Vitals 监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 故障排除

### 常见问题

1. **语音识别不工作**
   - 检查浏览器兼容性
   - 确认麦克风权限
   - 检查HTTPS配置

2. **API调用失败**
   - 检查网络连接
   - 验证API密钥
   - 检查CORS配置

3. **知识图谱渲染错误**
   - 检查数据格式
   - 验证节点ID唯一性
   - 检查浏览器控制台错误

### 调试命令
```bash
# 检查依赖
npm audit

# 修复安全漏洞
npm audit fix

# 清理缓存
npm cache clean --force

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

## 更新和维护

### 定期更新
```bash
# 检查过时依赖
npm outdated

# 更新依赖
npm update

# 更新主要版本
npm install package@latest
```

### 备份策略
- 定期备份代码仓库
- 导出用户数据
- 备份配置文件
- 监控系统状态

---

**📞 技术支持**

如遇到部署问题，请联系开发团队或提交Issue。