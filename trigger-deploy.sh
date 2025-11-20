#!/bin/bash

echo "🚀 触发 GitHub Pages 部署..."
echo ""

cd "/Users/again/Downloads/google Antigravity"

# 创建一个空提交来触发部署
git commit --allow-empty -m "触发 GitHub Pages 部署"

# 推送到 GitHub
git push

echo ""
echo "✅ 已触发部署！"
echo ""
echo "现在："
echo "1. 访问 https://github.com/Againliu/generic-config-cms/actions"
echo "2. 等待工作流完成（约 2-3 分钟）"
echo "3. 访问您的网站：https://againliu.github.io/generic-config-cms/"
echo ""
