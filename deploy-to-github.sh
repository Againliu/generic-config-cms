#!/bin/bash

echo "=========================================="
echo "  GitHub 部署助手"
echo "=========================================="
echo ""

# 检查是否已经有 remote
if git remote | grep -q "origin"; then
    echo "⚠️  检测到已存在 remote，先删除..."
    git remote remove origin
fi

echo "请按照以下步骤操作："
echo ""
echo "1️⃣  在浏览器中打开: https://github.com/new"
echo "   - 仓库名称填写: generic-config-cms"
echo "   - 选择 Public（公开）或 Private（私有）"
echo "   - 不要勾选任何选项"
echo "   - 点击 'Create repository'"
echo ""
echo "2️⃣  创建完成后，GitHub 会显示一个页面"
echo "   - 找到 'Quick setup' 部分"
echo "   - 复制类似这样的地址:"
echo "     https://github.com/YOUR_USERNAME/generic-config-cms.git"
echo ""
read -p "请粘贴您的仓库地址: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 未输入仓库地址，退出"
    exit 1
fi

echo ""
echo "3️⃣  正在配置远程仓库..."
git remote add origin "$REPO_URL"

echo "✅ 远程仓库配置完成！"
echo ""
echo "4️⃣  现在推送代码..."
echo ""

# 使用 HTTPS 方式推送（会弹出 GitHub 登录）
git push -u origin main

echo ""
echo "=========================================="
echo "✨ 部署完成！"
echo "=========================================="
echo ""
echo "接下来的步骤："
echo "1. 访问您的 GitHub 仓库"
echo "2. 点击 Settings → Pages"
echo "3. Source 选择 'GitHub Actions'"
echo "4. 等待几分钟后访问:"
echo "   https://YOUR_USERNAME.github.io/generic-config-cms/"
echo ""
