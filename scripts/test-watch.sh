#!/bin/bash

# 自动化测试监控脚本
# 当代码文件发生变化时，自动运行测试

echo "🚀 启动自动化测试监控..."
echo "📝 监控文件变化并自动运行测试"
echo "💡 提示: 按 Ctrl+C 退出监控"
echo ""

# 运行 Vitest 的 watch 模式
npm run test:watch
