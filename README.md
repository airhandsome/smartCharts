# AI图表生成器 🎨📊

一个基于Vue3的智能图表生成器，支持AI预测和手动数据输入，让数据可视化变得简单有趣！

## ✨ 功能特性

- 🎯 **图表可视化**: 通过输入格式化的JSON数据，快速生成各种类型的图表
- 🤖 **AI预测生成**: 只需描述需求，AI就能智能分析并生成相应的图表数据
- 🧠 **智能分析**: AI自动识别最佳图表类型，深度解读数据洞察
- 📱 **响应式设计**: 清爽现代的UI设计，支持各种屏幕尺寸
- 🚀 **纯前端项目**: 无需后端部署，开箱即用
- 📊 **多种图表类型**: 支持折线图、柱状图、饼图、散点图等

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **图表库**: ECharts + Vue-ECharts
- **HTTP客户端**: Axios
- **样式**: SCSS + CSS3

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📖 使用说明

### 1. 图表可视化

在"图表可视化"页面，你可以：

- 输入JSON格式的图表数据
- 查看实时预览
- 下载生成的图表
- 全屏查看图表

**数据格式示例**:
```json
{
  "chartType": "line",
  "title": "销售趋势",
  "xAxis": {
    "name": "月份",
    "data": ["1月", "2月", "3月", "4月"]
  },
  "yAxis": {
    "name": "销售额"
  },
  "series": [{
    "name": "销售额",
    "data": [120, 132, 101, 134],
    "type": "line"
  }]
}
```

### 2. AI预测生成

在"AI预测"页面，你可以：

- 用自然语言描述图表需求
- AI自动分析并生成图表数据
- 查看AI生成的图表和分析洞察

**示例查询**:
- "帮我预测2025年北京房价走势"
- "分析2024年中国GDP增长趋势"
- "预测未来5年新能源汽车销量"

### 3. 智能分析

在"智能分析"页面，你可以：

- 上传数据文件，AI自动识别最佳图表类型
- 获得图表类型推荐和置信度评分
- AI深度解读图表数据，提供专业洞察
- 导出分析报告，支持多种文件格式

## 🔧 配置说明

### DeepSeek API配置

项目支持接入DeepSeek API进行真实的AI预测。要启用此功能：

1. 复制 `env.example` 文件为 `.env`
2. 在 `.env` 文件中设置你的API密钥：
   ```
   VITE_DEEPSEEK_API_KEY=your_actual_api_key_here
   ```
3. 重启开发服务器

**注意**: 如果没有配置API密钥，系统将使用模拟数据进行演示。

## 📁 项目结构

```
chart-generator/
├── src/
│   ├── views/           # 页面组件
│   │   ├── Home.vue     # 首页
│   │   ├── ChartVisualizer.vue  # 图表可视化
│   │   └── AIPredictor.vue      # AI预测
│   ├── api.js           # API服务
│   ├── App.vue          # 主应用组件
│   └── main.js          # 应用入口
├── public/               # 静态资源
├── index.html            # HTML模板
├── package.json          # 项目配置
├── vite.config.js        # Vite配置
└── README.md             # 项目说明
```

## 🎨 设计特色

- **清爽背景**: 采用浅色背景，营造专业简洁的视觉效果
- **现代卡片**: 使用圆角卡片和柔和阴影，提升视觉层次
- **智能交互**: 悬停动画和加载状态，提供流畅的用户体验
- **响应式布局**: 支持各种屏幕尺寸，移动端友好
- **一键复制**: 数据格式说明支持一键复制，提升使用效率

## 🔮 未来计划

- [ ] 支持更多图表类型（雷达图、热力图等）
- [ ] 添加图表模板库
- [ ] 支持数据导入导出
- [ ] 添加协作功能
- [ ] 支持自定义主题

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目！

## 📄 许可证

MIT License

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue 3 UI组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

如果这个项目对你有帮助，请给个⭐️支持一下！
