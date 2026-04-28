# 星星大作战 - 部署说明

## 🚀 如何发布这个项目

### 方法一：使用 Vercel（推荐）

Vercel 是一个非常方便的平台，专门用于部署前端项目。

#### 步骤：
1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel --prod
   ```

4. 按照提示完成部署，Vercel 会自动构建并部署您的项目。

### 方法二：使用 Netlify

Netlify 也是一个很好的选择。

#### 步骤：
1. 访问 [Netlify](https://www.netlify.com/)
2. 注册或登录您的账户
3. 点击 "New site from Git"
4. 选择您的 GitHub/GitLab 仓库
5. 配置构建命令：`npm run build`
6. 配置输出目录：`dist`
7. 点击 "Deploy site"

### 方法三：使用 GitHub Pages

如果您使用 GitHub，可以直接使用 GitHub Pages。

#### 步骤：
1. 修改 `vite.config.ts`，添加 `base` 配置：
   ```typescript
   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
     base: '/your-repo-name/', // 替换为您的仓库名称
   })
   ```

2. 安装 `gh-pages`：
   ```bash
   npm install -D gh-pages
   ```

3. 在 `package.json` 中添加脚本：
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

4. 构建并部署：
   ```bash
   npm run build
   npm run deploy
   ```

### 方法四：使用服务器部署

如果您有自己的服务器，可以手动部署。

#### 步骤：
1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传文件**
   将 `dist` 目录中的所有文件上传到您的服务器。

3. **配置服务器**
   - 使用 Nginx、Apache 或其他 Web 服务器
   - 配置静态文件服务指向 `dist` 目录

### 项目要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 构建命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览生产版本
npm run preview
```

### 注意事项

1. **数据持久化**：当前项目使用 localStorage 存储数据，数据保存在用户浏览器中。
2. **密码安全**：家长模式密码（默认：147258）是硬编码的，如需修改，请编辑 `src/pages/PasswordPage.tsx`。
3. **环境变量**：如果需要添加环境变量，可以创建 `.env` 文件。

## 📱 访问地址

部署成功后，您将获得一个类似以下的 URL：
- Vercel: `https://your-project.vercel.app`
- Netlify: `https://your-project.netlify.app`
- GitHub Pages: `https://your-username.github.io/your-repo-name`

将这个 URL 分享给其他人，他们就可以访问您的「星星大作战」习惯养成系统了！
