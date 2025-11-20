# 通用配置管理系统 (Generic Config CMS)

一个基于 React + TypeScript 的通用配置管理系统，支持灵活的 Schema 设计和动态表单生成。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)

## ✨ 功能特性

### 📋 项目管理
- 创建和管理多个配置项目
- 每个项目独立的 Schema 和配置数据
- 项目导入导出（JSON 格式）

### 🎨 Schema 设计器
- 可视化字段管理
- 支持多种字段类型：
  - 字符串、数字、布尔值
  - 对象（支持嵌套属性）
  - 数组
  - 枚举选项
  - 仅字母数字
  - 国家码（249个国家/地区，支持搜索和多选）
  - ICC 代码（228个，支持搜索和多选）
- 字段排序功能
- 实时自动保存

### 📝 数据管理
- 基于 Schema 的动态表单
- 支持多种自定义组件：
  - 标签输入
  - 穿梭框
  - JSON 编辑器（Monaco Editor）
  - 多选下拉框（支持搜索）
- 表单验证（中文错误提示）
- 数据列表展示（支持分页和横向滚动）

### 💾 数据持久化
- 使用 localStorage 自动保存
- 导出配置为 JSON 文件
- 支持批量数据管理

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🧪 测试

运行所有测试：
```bash
npm test
```

监控模式（开发时推荐）：
```bash
npm run test:watch
```

可视化测试界面：
```bash
npm run test:ui
```

生成覆盖率报告：
```bash
npm run test:coverage
```

详细测试文档请查看 [TESTING.md](./TESTING.md)

## 📦 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件**: Ant Design 5
- **表单**: react-jsonschema-form + AJV
- **编辑器**: Monaco Editor
- **状态管理**: Zustand
- **测试**: Vitest + Testing Library

## 📖 使用说明

### 1. 创建项目

1. 点击"新建项目"按钮
2. 输入项目名称和描述
3. 可选择加载预设模板（功能开关、环境配置）

### 2. 设计 Schema

1. 进入项目详情页
2. 切换到"字段管理"标签
3. 点击"添加字段"配置字段属性
4. 使用上移/下移调整字段顺序

### 3. 管理配置数据

1. 切换到"数据管理"标签
2. 点击"添加配置项"
3. 填写表单并保存
4. 支持编辑、删除操作

### 4. 导出数据

点击"导出项目配置"下载 JSON 文件到本地。

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── FormEngine/     # 动态表单引擎
│   │   └── widgets/    # 自定义表单组件
│   ├── ProjectDetail/  # 项目详情页
│   ├── ProjectList/    # 项目列表
│   └── SchemaDesigner/ # Schema 设计器
├── constants/          # 常量配置
│   └── predefinedOptions.ts  # 国家码和ICC数据
├── store/             # Zustand 状态管理
├── templates/         # Schema 模板
└── test/              # 测试配置

scripts/
└── generateOptions.js # Excel 数据转换脚本
```

## 🔧 自定义字段类型

如需添加新的字段类型：

1. 在 `FieldModal.tsx` 中添加类型选项
2. 在 `handleOk` 中添加处理逻辑
3. 如需自定义 UI，在 `FormEngine/widgets/` 创建新组件
4. 在 `FormEngine.tsx` 注册 widget

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
