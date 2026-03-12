# 文档B：Tailwind（NativeWind）迁移指南

本项目已按本文档完成从 `StyleSheet/inline style` 到 `NativeWind className` 的迁移。  
后续样式开发请继续严格遵循同一流程。

## 1. 依赖与基础文件

### 1.1 安装依赖

```bash
npm install nativewind
npm install -D tailwindcss
```

> 如果项目里已经有 `tailwindcss`，第二行会是 no-op；保留这一步是为了保证迁移流程可复现。

### 1.2 新增配置文件

1. `tailwind.config.js`

```js
/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
```

2. `babel.config.js`

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: ["expo-router/babel", "nativewind/babel", "react-native-reanimated/plugin"],
  };
};
```

3. `metro.config.js`

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

4. `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. `nativewind-env.d.ts`

```ts
/// <reference types="nativewind/types" />
```

6. 在 `app/_layout.tsx` 顶部引入：

```ts
import "../global.css";
```

## 2. 样式迁移规则（StyleSheet -> className）

迁移原则：

- 禁用 `StyleSheet.create`。
- 禁用 JSX 内联 `style={{ ... }}`。
- 统一改为 `className`。

常见映射：

- `flex: 1` -> `flex-1`
- `paddingHorizontal: 20` -> `px-5`
- `paddingTop: 80` -> `pt-20`
- `marginTop: 30` -> `mt-[30px]`
- `borderRadius: 60` -> `rounded-full`
- `backgroundColor: "#FFF"` -> `bg-white`
- `borderWidth: 1` + `borderColor: "#c0c0c0"` -> `border border-[#c0c0c0]`
- `position: "absolute"` + `bottom: 60` -> `absolute bottom-[60px]`
- `textDecorationLine: "line-through"` -> `line-through`

> 重点：`text-decoration-line: line-through` 在 NativeWind 对应 `line-through`。

## 3. 本项目已迁移范围

- `app/index.tsx`
- `components/Task.tsx`
- `scripts/reset-project.js`（模板代码中的内联 style 也已替换）

## 4. 复现环境方法

1. 安装依赖：`npm install`
2. 启动项目：`npm run start`（如遇缓存问题可用 `npx expo start -c`）
3. 启动后检查：
   - 页面渲染无 `className` 相关报错。
   - Task 列表样式与迁移前一致。
   - 完成态 `line-through` 正常生效。

## 5. 新增样式开发规范

- 仅使用 `className` 写样式。
- 需条件样式时，使用模板字符串拼接 class。
- 新组件提交前，执行：

```bash
npm run lint
```
