# 自动化测试指南

## 概述

本项目使用 **Vitest** 作为测试框架，配合 **React Testing Library** 进行组件测试。测试系统支持自动监控代码变化并运行测试，确保代码质量。

## 快速开始

### 1. 运行所有测试（单次）

```bash
npm test
```

### 2. 启动监控模式（推荐）

**每次修改代码后自动运行测试：**

```bash
npm run test:watch
```

或使用快捷脚本：

```bash
./scripts/test-watch.sh
```

### 3. 查看测试 UI 界面

```bash
npm run test:ui
```

在浏览器中打开可视化测试界面，方便调试和查看测试结果。

### 4. 生成测试覆盖率报告

```bash
npm run test:coverage
```

报告将生成在 `coverage/` 目录下。

## 测试结构

```
src/
├── store/
│   └── __tests__/
│       └── useAppStore.test.ts       # Store 状态管理测试
├── components/
│   ├── ProjectList/
│   │   └── __tests__/
│   │       └── ProjectList.test.tsx  # 项目列表组件测试
│   └── SchemaDesigner/
│       └── __tests__/
│           └── FieldModal.test.tsx   # 字段编辑弹窗测试
└── test/
    └── setup.ts                       # 测试环境配置
```

## 已实现的测试

### Store 测试 (`useAppStore.test.ts`)

- ✅ 项目创建
- ✅ 项目删除
- ✅ 项目 Schema 更新
- ✅ 配置项添加
- ✅ 配置项更新
- ✅ 配置项删除

### 组件测试

#### ProjectList (`ProjectList.test.tsx`)

- ✅ 项目列表渲染
- ✅ 项目卡片点击
- ✅ 配置项数量显示

#### FieldModal (`FieldModal.test.tsx`)

- ✅ 添加模式渲染
- ✅ 编辑模式渲染
- ✅ 字段名称重复验证
- ✅ 字段名称格式验证
- ✅ 表单提交

## 编写新测试

### 测试文件命名规范

- 测试文件放在 `__tests__/` 目录下
- 文件名格式：`ComponentName.test.tsx` 或 `fileName.test.ts`

### 示例：组件测试

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### 示例：Store 测试

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({ projects: [] });
  });

  it('should add project', () => {
    const { addProject } = useAppStore.getState();
    addProject('Test');
    expect(useAppStore.getState().projects).toHaveLength(1);
  });
});
```

## 持续集成建议

在 CI/CD 流程中添加测试步骤：

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test

- name: Upload coverage
  run: npm run test:coverage
```

## 最佳实践

1. **每次提交前运行测试**：确保代码变更不会破坏现有功能
2. **使用 watch 模式开发**：实时反馈，快速发现问题
3. **保持测试覆盖率**：目标 > 80%
4. **测试关键路径**：优先测试核心业务逻辑
5. **Mock 外部依赖**：保持测试独立性和速度

## 故障排查

### 测试失败

1. 检查错误信息
2. 使用 `test:ui` 查看详细堆栈
3. 确保 mock 数据正确

### 测试运行缓慢

1. 减少不必要的渲染
2. 使用 `vi.mock()` 模拟重型依赖
3. 检查是否有异步操作未正确处理

## 相关资源

- [Vitest 文档](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
