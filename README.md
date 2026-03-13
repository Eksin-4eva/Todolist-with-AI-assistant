# Todolist with AI Assistant

基于 Expo Router + NativeWind + Zustand + Supabase 的 Todo List，带用户认证和 AI 任务分析功能。

## 功能

- 用户名密码注册/登录（Supabase Auth）
- 新增、完成、删除任务（数据持久化至 Supabase）
- 每个用户数据隔离（RLS）
- AI 助手分析待办事项，一键执行建议（通义千问 qwen-plus）

## 技术栈

- Expo SDK 55 / React Native 0.83 / React 19
- `expo-router` 文件路由 + Tabs 底部导航
- NativeWind v4 + TailwindCSS v3
- Zustand 状态管理
- Supabase（数据库 + 认证）
- 通义千问 qwen-plus（AI 分析）
- TypeScript strict

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 填入 Supabase URL、anon key、Qwen API key

# 3. 在 Supabase Dashboard 执行建表 SQL（见 docs/supabase-schema.md）

# 4. 启动
npx expo start --clear
```

## 目录结构

```
app/
  (tabs)/
    _layout.tsx      底部导航栏
    index.tsx        待办页面
    ai.tsx           AI 助手页面
  _layout.tsx        根布局，路由守卫
  auth.tsx           登录/注册页面
  index.tsx          重定向至 /(tabs)
components/
  Task.tsx           单条任务组件
store/
  todoStore.ts       Zustand store（CRUD + Supabase）
lib/
  supabase.ts        Supabase 客户端
.env.example         环境变量模板
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `EXPO_PUBLIC_QWEN_API_KEY` | 阿里云百炼 API Key |

## 常用命令

```bash
npx expo start --clear   # 清缓存启动
npm run lint             # 代码检查
```
