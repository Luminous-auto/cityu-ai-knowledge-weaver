# CityU AI Knowledge Weaver 🎓

## 智能语音转写系统

专为香港城市大学学生打造的智能语音转写平台，支持实时语音识别、多语言检测、连续录音等功能。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.12.8-1890ff.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 功能特点

### 🎤 智能语音识别
- **连续录音**: 支持长时间连续录音，可记录整堂课内容
- **实时转写**: 实时将语音转换为文字，无需等待
- **高精度识别**: 基于浏览器原生 Web Speech API，识别准确率高

### 🌍 多语言支持
- **English** (英语)
- **Mandarin** (普通话)
- **Cantonese** (粤语)
- **Japanese** (日语)
- **Korean** (韩语)

### 🤖 智能语言检测
- **自动检测**: 使用 LibreTranslate API 自动检测语言
- **备选方案**: 集成 Franc 库作为离线备选检测方案
- **智能切换**: 根据检测结果自动切换识别语言

### 💾 数据安全
- **自动备份**: 录音内容自动保存到本地存储
- **防丢失**: 页面刷新或意外关闭后可恢复内容
- **本地存储**: 所有数据保存在本地，保护隐私

### 📱 用户体验
- **响应式设计**: 支持桌面和移动设备
- **现代UI**: 基于 Ant Design 的美观界面
- **实时统计**: 显示字符数、词数、录音时长等信息
- **一键下载**: 支持将转写结果导出为文本文件

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- 现代浏览器 (Chrome, Edge, Safari)

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

### 构建生产版本
```bash
npm run build
```

## 🛠️ 技术栈

### 前端框架
- **React 18.2.0**: 现代化的前端框架
- **Ant Design 5.12.8**: 企业级UI组件库
- **Ant Design Icons**: 丰富的图标库

### 核心功能
- **Web Speech API**: 浏览器原生语音识别
- **Axios**: HTTP 客户端，用于语言检测API调用
- **Franc**: 离线语言检测库

### 开发工具
- **React Scripts**: 零配置的React开发工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化

## 📖 使用指南

### 1. 开始录音
1. 点击 **"开始录音"** 按钮
2. 首次使用需要授权麦克风权限
3. 开始说话，系统会实时转写语音内容

### 2. 语言设置
- **自动检测**: 系统会根据说话内容自动检测语言
- **手动选择**: 可在下拉菜单中手动选择识别语言
- **实时切换**: 录音过程中可随时切换语言

### 3. 文本编辑
- 转写结果可直接在文本框中编辑
- 支持复制、粘贴等常用操作
- 实时显示字符数和词数统计

### 4. 保存和导出
- **自动备份**: 内容会自动保存到浏览器本地存储
- **手动下载**: 点击 **"下载文本"** 按钮导出文件
- **恢复备份**: 页面重新加载时可恢复之前的内容

## 🔧 配置说明

### 语音识别配置
```javascript
// 识别器配置
recognitionInstance.continuous = true;      // 连续识别
recognitionInstance.interimResults = true;  // 显示临时结果
recognitionInstance.lang = detectedLang;    // 识别语言
recognitionInstance.maxAlternatives = 1;    // 最大候选数
```

### 语言检测API
```javascript
// LibreTranslate API
const response = await axios.post('https://libretranslate.de/detect', {
  q: text.slice(-300) // 取最后300个字符进行检测
}, {
  timeout: 5000 // 5秒超时
});
```

## 🌐 浏览器兼容性

| 浏览器 | 版本要求 | 语音识别支持 |
|--------|----------|-------------|
| Chrome | >= 25 | ✅ 完全支持 |
| Edge | >= 79 | ✅ 完全支持 |
| Safari | >= 14.1 | ✅ 完全支持 |
| Firefox | >= 最新版 | ❌ 不支持 |

## 🔒 隐私保护

- **本地处理**: 语音识别在浏览器本地进行，不上传音频
- **数据安全**: 转写内容仅保存在本地存储中
- **API调用**: 仅在语言检测时调用外部API，不传输敏感内容
- **用户控制**: 用户可随时清空数据和备份

## 🐛 故障排除

### 常见问题

**Q: 无法开始录音？**
A: 请检查：
- 浏览器是否支持语音识别
- 麦克风权限是否已授权
- 是否使用HTTPS协议访问

**Q: 识别准确率低？**
A: 建议：
- 在安静环境中使用
- 说话清晰，语速适中
- 选择正确的识别语言

**Q: 页面刷新后内容丢失？**
A: 系统会自动提示恢复备份，点击确认即可恢复。

### 错误代码说明

| 错误代码 | 说明 | 解决方案 |
|---------|------|----------|
| no-speech | 未检测到语音 | 检查麦克风或重新说话 |
| network | 网络错误 | 检查网络连接 |
| not-allowed | 权限被拒绝 | 重新授权麦克风权限 |

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 开发团队

- **CityU Students** - 初始开发和维护

## 🙏 致谢

- [React](https://reactjs.org/) - 前端框架
- [Ant Design](https://ant.design/) - UI组件库
- [LibreTranslate](https://libretranslate.com/) - 语言检测API
- [Franc](https://github.com/wooorm/franc) - 离线语言检测
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - 语音识别

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 📧 Email: [your-email@cityu.edu.hk]
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Made with ❤️ by CityU Students**