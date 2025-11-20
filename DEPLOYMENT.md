# GitHub 部署指南

## 🚀 部署步骤

### 1. 在 GitHub 上创建仓库

1. 登录 GitHub (https://github.com)
2. 点击右上角的 "+" → "New repository"
3. 填写信息：
   - **Repository name**: `generic-config-cms`
   - **Description**: 通用配置管理系统
   - **Public** 或 **Private**（根据需要选择）
   - **不要** 勾选 "Add a README file"、"Add .gitignore"、"Choose a license"
4. 点击 "Create repository"

### 2. 推送代码到 GitHub

在项目目录中执行以下命令（替换 `YOUR_USERNAME` 为您的 GitHub 用户名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/generic-config-cms.git

# 重命名分支为 main（如果需要）
git branch -M main

# 推送代码
git push -u origin main
```

### 3. 配置 GitHub Pages

1. 在 GitHub 仓库页面，点击 **Settings**
2. 在左侧菜单找到 **Pages**
3. 在 "Source" 下选择：
   - **Source**: GitHub Actions
4. 等待几分钟，GitHub Actions 会自动构建和部署

### 4. 访问您的网站

部署完成后，您的网站将可以通过以下地址访问：

```
https://YOUR_USERNAME.github.io/generic-config-cms/
```

## 🔄 自动部署

已配置 GitHub Actions！每次推送到 `main` 分支时，会自动：
1. 安装依赖
2. 运行构建
3. 部署到 GitHub Pages

查看部署状态：
- 进入仓库的 "Actions" 标签
- 查看最新的 workflow 运行状态

## 📝 后续更新

当有代码更新时，只需：

```bash
git add .
git commit -m "描述您的更改"
git push
```

GitHub Actions 会自动重新部署！

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## ⚠️ 注意事项

1. **Base Path**: 已配置 `base: '/generic-config-cms/'`，如果您的仓库名不同，需要修改 `vite.config.ts`
2. **localStorage**: 数据保存在浏览器本地，清除浏览器数据会丢失配置
3. **导出数据**: 重要数据请及时导出备份

## 🔐 隐私

如果您的配置包含敏感信息：
- 建议将仓库设置为 Private
- 或者使用环境变量管理敏感数据
- 定期导出备份到安全位置

## 📚 更多资源

- [GitHub Pages 文档](https://docs.github.com/pages)
- [GitHub Actions 文档](https://docs.github.com/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
