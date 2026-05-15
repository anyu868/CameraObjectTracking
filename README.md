# VisionTracker - Web端实时物体识别与跟踪系统

一个基于 Web 技术的实时物体识别与目标跟踪系统。通过浏览器摄像头捕获视频流，使用 TensorFlow.js 和 COCO SSD 模型进行实时物体检测，并支持用户选择特定目标进行持续跟踪。

## ✨ 功能特性

- 📹 **实时摄像头捕获** - 通过 WebRTC 访问摄像头，实时获取视频流
- 🔍 **物体检测** - 使用 COCO SSD 模型检测 80 种常见物体
- 🎯 **目标选择** - 点击视频中的物体选择要跟踪的目标
- 📍 **实时跟踪** - 持续跟踪选定的目标，支持移动轨迹绘制
- ⚡ **性能监控** - 实时显示 FPS、检测状态等信息
- 🔄 **摄像头切换** - 支持前置/后置摄像头切换（移动设备）
- 🎨 **现代化 UI** - 响应式设计，流畅的动画效果

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 样式**: Tailwind CSS
- **状态管理**: Zustand
- **AI/ML**: TensorFlow.js + Coco SSD
- **视频处理**: WebRTC + Canvas API
- **构建工具**: Vite

## 📦 安装与运行

### 前置要求

- Node.js 18+
- npm 或 yarn
- 现代浏览器（Chrome 80+, Firefox 75+, Safari 14+, Edge 80+）

### 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd workspace

# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

在浏览器中打开 http://localhost:5173/

### 构建生产版本

```bash
npm run build
```

## 🚀 使用指南

1. **启动摄像头**: 点击"启动摄像头"按钮授予摄像头权限
2. **开始检测**: 点击"开始检测"按钮启动物体检测
3. **选择目标**: 在视频中点击想要跟踪的物体
4. **查看跟踪**: 系统会自动跟踪选定的目标，并在视频上绘制移动轨迹
5. **重置跟踪**: 点击"重置跟踪"按钮可以重新选择其他目标

### 控制面板

- **开始/停止检测**: 切换物体检测的运行状态
- **切换摄像头**: 在多个摄像头之间切换
- **显示轨迹**: 显示/隐藏目标移动轨迹
- **显示 FPS**: 显示/隐藏帧率监控

## 📁 项目结构

```
workspace/
├── src/
│   ├── components/           # React 组件
│   │   ├── VideoCanvas.tsx      # Canvas 渲染组件
│   │   ├── VideoPreview.tsx     # 视频预览组件
│   │   ├── ControlPanel.tsx     # 控制面板组件
│   │   ├── StatusPanel.tsx      # 状态显示组件
│   │   └── DetectionController.tsx  # 检测控制器
│   ├── hooks/                # React Hooks
│   │   ├── useCamera.ts         # 摄像头管理
│   │   ├── useObjectDetection.ts # 物体检测
│   │   ├── useObjectTracking.ts  # 目标跟踪
│   │   └── useFPS.ts            # FPS 计算
│   ├── store/                # Zustand 状态管理
│   │   └── useStore.ts
│   ├── pages/                # 页面组件
│   │   └── Home.tsx
│   └── App.tsx               # 主应用组件
├── public/                  # 静态资源
├── .trae/                   # 项目文档
│   └── documents/
│       └── 技术方案文档.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 核心模块

### 物体检测模块

使用 TensorFlow.js 的 Coco SSD 预训练模型，该模型基于 COCO 数据集训练，支持检测 80 种常见物体类别，包括：

- 人、动物（猫、狗等）
- 交通工具（汽车、自行车、飞机等）
- 日常物品（手机、书籍、家具等）
- 食物（水果、餐具等）

### 目标跟踪模块

实现基于 IOU（Intersection over Union）的目标跟踪算法：

1. **目标选择**: 用户点击视频中的物体进行选择
2. **特征匹配**: 在连续帧中寻找与目标最匹配的检测结果
3. **轨迹记录**: 记录目标的历史位置信息
4. **丢失处理**: 目标暂时消失时保持跟踪状态

### 可视化模块

使用 Canvas API 实现实时渲染：

- 检测边界框绘制
- 类别标签和置信度显示
- 移动轨迹可视化
- FPS 和性能指标显示

## 🎯 性能优化

- 使用 `requestAnimationFrame` 实现流畅的渲染循环
- 模型懒加载，不阻塞页面初始化
- 合理的帧率控制（15-30 FPS）
- Canvas 绘制优化，减少重绘次数

## 📱 浏览器兼容性

| 浏览器 | 最低版本 | 支持情况 |
|--------|---------|---------|
| Chrome | 80+ | ✅ 完全支持 |
| Firefox | 75+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 80+ | ✅ 完全支持 |

## 🐛 已知问题

- 某些浏览器可能需要 HTTPS 才能访问摄像头
- 移动设备性能可能受限
- 跟踪算法在目标快速移动时可能丢失

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [TensorFlow.js](https://www.tensorflow.org/js) - JavaScript 机器学习库
- [Coco SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) - 预训练目标检测模型
- [React](https://reactjs.org/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具

---

**开发日期**: 2026-05-15 - 2026-05-22
**技术方案文档**: [.trae/documents/技术方案文档.md](.trae/documents/技术方案文档.md)
