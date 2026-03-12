# Todolist (Expo Router + NativeWind)

一个基于 Expo (SDK 55) + `expo-router` 的 Todo List 示例项目，样式使用 NativeWind (Tailwind CSS) 的 `className` 写法。

## 功能

- 新增任务
- 标记完成/取消完成
- 删除任务
- 支持 iOS / Android / Web 运行（Expo）

> 当前任务数据仅保存在内存中，刷新/重启会丢失。

## 技术栈

- Expo SDK 55 / React Native 0.83 / React 19
- `expo-router`（文件路由，入口在 `app/`）
- NativeWind v4 + TailwindCSS v3（`global.css`）
- TypeScript（`strict: true`）+ ESLint（`npm run lint`）

## 运行环境

- Node.js (建议 18+ LTS)
- npm
- Expo Go（真机）或本地 iOS/Android 模拟器

## 快速开始

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run start
```

常用命令：

```bash
npm run android
npm run ios
npm run web
npm run lint
```

如遇缓存/样式未生效等问题可清缓存重启：

```bash
npx expo start -c
```

## 目录结构

```text
app/                 Expo Router 路由（页面）
  _layout.tsx        Root layout（全局引入 global.css）
  index.tsx          Todo 主页面
components/          可复用组件
  Task.tsx           单条任务组件（勾选/删除）
hooks/               自定义 hooks（颜色模式等）
constants/           常量（主题色等）
assets/              图片/图标资源
scripts/             脚本（reset-project 来自 Expo 模板）
global.css           Tailwind 入口样式（@tailwind base/components/utilities）
tailwind.config.js   Tailwind/NativeWind 配置
metro.config.js      NativeWind Metro 配置（withNativeWind + global.css）
babel.config.js      Expo/Router/Reanimated 配置
```

## 样式约定（NativeWind）

- 推荐仅使用 `className` 写样式，避免 `StyleSheet.create` 和 JSX 内联 `style={{...}}`
- `app/_layout.tsx` 顶部需要引入 `../global.css`，否则 Tailwind 样式不会生效
- 迁移记录见：[nativewind迁移教程.md](./nativewind迁移教程.md)

## 备注

- `app.json` 已开启 `newArchEnabled: true`，并启用 `typedRoutes`/`reactCompiler` 实验特性。
- 本仓库目前未接入 AI 助手能力； “AI assistant” 是规划方向，可在此基础上继续扩展（例如自然语言创建/整理任务、自动拆解任务等）。
