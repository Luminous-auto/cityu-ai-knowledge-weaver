# 🎓 CityU AI Knowledge Weaver

> 专为城大学生打造的智能语音转写与知识管理系统

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.12.8-blue.svg)](https://ant.design/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ 核心功能

### 🎤 智能语音转写
- **实时语音识别**：基于Web Speech API的高精度语音转文字
- **连续录音**：支持长时间不间断录音，适合整堂课记录
- **即时停止**：优化的录音控制，响应迅速

### 🌍 多语言支持
- **自动语言检测**：智能识别语音语言并切换识别模式
- **实时翻译**：集成Google Translate API，支持多种目标语言
- **双语对照**：原文与译文同步显示

### 🏷️ 智能术语提取
- **NER技术**：基于自然语言处理的命名实体识别
- **学术术语**：专门优化学术和技术术语的识别
- **智能过滤**：自动过滤无效和重复术语

### 📚 知识卡片系统
- **Wikipedia集成**：点击术语即可查看Wikipedia摘要
- **知识链接**：构建术语间的关联关系
- **快速查询**：即时获取术语解释和背景信息

### 📊 知识图谱可视化
- **动态图谱**：实时构建术语关系网络
- **交互式界面**：支持缩放、拖拽等交互操作
- **美观展示**：现代化的图形界面设计

### 📄 文档导出功能
- **Markdown格式**：导出完整的课堂笔记
- **结构化内容**：包含原文、译文、术语和统计信息
- **双链支持**：支持Obsidian等知识管理工具的双链格式

## 🚀 快速开始

### 环境要求
- Node.js 16.0+
- 现代浏览器（Chrome、Edge、Safari）
- 麦克风权限

### 安装步骤

```bash
# 克隆项目
git clone [your-repo-url]
cd cityu-ai-knowledge-weaver

# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 浏览器访问
打开 http://localhost:3000 开始使用

## 🎯 完整使用流程

1. **🎤 开始录音** - 点击录音按钮，授权麦克风权限
2. **📝 实时转写** - 系统自动将语音转换为文字
3. **🔍 语言检测** - 自动识别语言并优化识别精度
4. **🏷️ 术语提取** - 点击"Extract Terms"提取学术术语
5. **🌐 自动翻译** - 选择目标语言进行实时翻译
6. **📊 构建图谱** - 点击"Build Knowledge Graph"生成知识图谱
7. **📚 查看卡片** - 点击术语查看Wikipedia知识卡片
8. **📄 导出文档** - 点击"Export to Markdown"保存完整笔记

## 🔧 技术架构

### 前端技术栈
- **React 18.2.0** - 现代化前端框架
- **Ant Design 5.12.8** - 企业级UI组件库
- **Web Speech API** - 浏览器原生语音识别
- **react-vis-network-graph** - 知识图谱可视化
- **react-markdown** - Markdown渲染
- **file-saver** - 文件下载功能

### API集成
- **Google Translate API** - 多语言翻译服务
- **Wikipedia REST API** - 知识卡片数据源
- **自定义NER API** - 术语提取服务

### 项目结构
```
src/
├── components/
│   └── Transcription.js     # 主要功能组件
├── services/
│   └── api.js              # API服务层
├── App.js                  # 应用入口
└── index.js               # React入口
```

## 🛠️ 核心功能实现

### 语音识别优化
```javascript
// 连续录音配置
recognitionInstance.continuous = true;
recognitionInstance.interimResults = true;
recognitionInstance.maxAlternatives = 1;
```

### 知识图谱去重
```javascript
// 三重唯一性保证
const nodes = uniqueTerms.map((term, index) => ({
  id: `node_${timestamp}_${randomSeed}_${index}`,
  label: term,
  // ...其他配置
}));
```

### 实时翻译防抖
```javascript
// 防抖优化，避免频繁API调用
useEffect(() => {
  const timer = setTimeout(() => {
    autoTranslate(transcribedText, targetLang);
  }, 1000);
  return () => clearTimeout(timer);
}, [transcribedText, targetLang]);
```

## 🔧 已解决的技术问题

### ✅ 知识图谱重复ID错误
- **问题**：vis-network库检测到重复节点ID
- **解决**：实现三重唯一性保证机制
- **方案**：时间戳 + 随机种子 + 索引

### ✅ Modal deprecated警告
- **问题**：Ant Design Modal组件API更新
- **解决**：将`visible`属性更新为`open`

### ✅ 录音停止延迟
- **问题**：停止录音响应缓慢
- **解决**：优化事件监听器管理和状态更新

### ✅ 翻译功能优化
- **问题**：频繁API调用和CORS错误
- **解决**：实现防抖机制和API切换

## 📊 性能优化

- **防抖机制**：减少不必要的API调用
- **状态管理**：优化React状态更新
- **内存管理**：及时清理事件监听器
- **错误处理**：完善的异常捕获机制

## 🌟 特色亮点

1. **🎯 专为学术场景优化** - 针对课堂录音和学术内容设计
2. **🔄 完整工作流程** - 从录音到导出的一站式解决方案
3. **🎨 现代化界面** - 美观易用的用户界面
4. **⚡ 实时处理** - 所有功能都支持实时处理
5. **🔗 知识关联** - 构建术语间的语义关系
6. **📱 响应式设计** - 适配不同屏幕尺寸

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发环境设置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 运行测试
npm test

# 构建生产版本
npm run build
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

**🚀 让学习更智能，让知识更有序！**

> 如果这个项目对你有帮助，请给我们一个 ⭐ Star！
