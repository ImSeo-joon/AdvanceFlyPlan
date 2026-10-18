# ADVANCE 飞跃计划 · GitHub Pages 静态网站

这是一个可直接推送到 GitHub、并通过 GitHub Pages 发布的纯静态项目。网站入口为根目录下的 `index.html`，无需构建或后端服务。

## 本地预览

直接双击 `index.html` 即可。也可以在项目目录运行：

```powershell
python -m http.server 8080
```

访问 `http://localhost:8080`。

## 推送到 GitHub

先在 GitHub 创建一个空仓库，然后在本目录执行：

```powershell
git init -b main
git add .
git commit -m "Initial ADVANCE website"
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

发布地址通常为：

```text
https://<你的用户名>.github.io/<仓库名>/
```

## 启用 GitHub Pages

本项目已包含自动部署工作流 `.github/workflows/pages.yml`。

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中将 **Source** 设为 **GitHub Actions**。
3. 推送到 `main` 分支后，等待工作流完成即可。

也可以不使用工作流，改为 **Deploy from a branch → main → / (root)**。根目录已经包含 `.nojekyll`。

## 文件结构

```text
.
├── index.html
├── styles.css
├── app.js
├── 404.html
├── robots.txt
├── .nojekyll
├── .github/
│   └── workflows/
│       └── pages.yml
└── assets/
    ├── advance-logo-white.png
    ├── anhui-campus.jpg
    ├── favicon.png
    ├── qr-official.jpg
    ├── qr-video.jpg
    └── qr-wechat.jpg
```

## 页面内容

- 品牌主视觉与快速路径
- 提前规划的现实问题
- 六项核心能力
- 大一至大四上成长路径
- 三大成长系统
- 1+N 导师协同与学科资源矩阵
- 六维竞争力模型
- 五项服务模块与月度管理闭环
- 标准版 / 旗舰版 / C9 版配置对照
- 成果边界与申请表达
- 加入流程、方向初筛、咨询二维码与常见问题

## 说明

- 所有交互均为前端本地实现，不收集、不上传个人信息。
- 品牌标志、校园影像与二维码素材整理自《飞跃计划手册 · 安徽大学》。
- 具体服务、资源配置与服务边界以正式合同及当年政策为准。

