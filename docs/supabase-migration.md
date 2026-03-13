# Supabase 集成迁移文档

## 背景

原项目状态仅存在内存中（Zustand），刷新后丢失。本次迁移将数据持久化至 Supabase，并增加用户名密码登录注册功能，每个用户只能看到自己的任务。

---

## 一、Supabase 控制台配置

### 1. 建表与 RLS

详见 [docs/supabase-schema.md](./supabase-schema.md)。

### 2. 开启 Email 认证

Dashboard → Authentication → Providers → Email，确保已启用。

---

## 二、代码变更

### 1. 安装依赖

```bash
npm install @supabase/supabase-js
```

### 2. 环境变量

新建 `.env`（已加入 `.gitignore`）：

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_QWEN_API_KEY=your-qwen-api-key
```

复制 `.env.example` 作为模板给团队成员。

### 3. 文件变更一览

| 文件 | 变更 |
|------|------|
| `.env` | 新增，存放 Supabase URL、anon key、Qwen API key |
| `.env.example` | 新增，环境变量模板 |
| `.gitignore` | 新增 `.env` 忽略规则 |
| `lib/supabase.ts` | 新增，创建 Supabase 客户端 |
| `app/auth.tsx` | 新增，登录/注册页面（用户名密码） |
| `app/_layout.tsx` | 更新，监听 session 状态，未登录跳转 `/auth`，登录后跳转 `/(tabs)` |
| `app/(tabs)/_layout.tsx` | 新增，底部导航栏（待办 + AI 助手） |
| `app/(tabs)/index.tsx` | 新增，待办页面（从 index.tsx 迁移） |
| `app/(tabs)/ai.tsx` | 新增，AI 助手页面 |
| `app/index.tsx` | 更新，重定向至 `/(tabs)` |
| `store/todoStore.ts` | 更新，所有操作改为异步，绑定 `user_id` |
| `docs/supabase-schema.md` | 新增，建表 SQL 存档 |

---

## 三、核心实现说明

### 路由守卫（`_layout.tsx`）

```ts
supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session);
});

useEffect(() => {
  if (!initialized) return;
  const inAuth = segments[0] === 'auth';
  if (!session && !inAuth) router.replace('/auth');
  else if (session && inAuth) router.replace('/(tabs)');
}, [session, initialized]);
```

### 数据隔离（`todoStore.ts`）

每次操作前获取当前用户，insert 时写入 `user_id`，fetch 时用 `.eq('user_id', user.id)` 过滤：

```ts
const { data: { user } } = await supabase.auth.getUser();
await supabase.from('tasks').insert({ text, completed: false, user_id: user?.id });
```

RLS policy 在数据库层面也做了二次保护。

---

## 四、复现方法

1. 在 [supabase.com](https://supabase.com) 创建新项目
2. 执行 [docs/supabase-schema.md](./supabase-schema.md) 中的建表和 RLS SQL
3. 复制 `.env.example` 为 `.env`，填入项目的 URL 和 anon key（Dashboard → Project Settings → API）
4. `npm install`
5. `npx expo start`

---

## 五、后续可扩展

- **实时同步**：用 `supabase.channel().on('postgres_changes', ...)` 监听数据库变更，多端实时同步
- **OAuth 登录**：在 Supabase Dashboard 开启 Google / GitHub provider，调用 `supabase.auth.signInWithOAuth()`
- **离线支持**：结合 `zustand/middleware` 的 `persist` + AsyncStorage 做本地缓存
