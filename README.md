# Next Admin · 基于 Next.js 16 的后台管理系统模板

一个基于 **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4** 构建的轻量级后台管理系统模板，演示了**后端 API 路由**、**状态管理**、**数据表格**、**侧边栏布局**等常见后台功能的完整实现。

---

## ✨ 功能特性

- 🎯 **后台管理布局** — 左侧固定侧边栏 + 顶部面包屑/搜索栏 + 主内容区
- 📊 **数据统计卡片** — 任务总数 / 进行中 / 已完成 / 完成率（带进度条）
- 📝 **任务管理（Todo CRUD）** — 新增、标记完成、删除、批量清除已完成
- 🔍 **实时搜索与筛选** — 按关键字搜索任务内容，按状态（全部/进行中/已完成）筛选
- 🌐 **后端 API 路由** — 基于 Next.js Route Handlers 的 RESTful API（`GET / POST / PUT / DELETE`）
- ⚡ **最佳实践** — Server Component 拉数据 + Client Component 做交互，符合 React 19 规范
- 🎨 **现代化 UI** — Tailwind CSS v4 实现，响应式布局，自定义滚动条

---

## 🛠 技术栈

| 技术 | 版本 | 作用 |
|------|------|------|
| [Next.js](https://nextjs.org) | 16.2.9 | 全栈框架（App Router + Route Handlers） |
| [React](https://react.dev) | 19.2.4 | 前端组件库（支持新 Hook 与 Suspense） |
| [TypeScript](https://www.typescriptlang.org) | 5.x | 类型安全 |
| [Tailwind CSS](https://tailwindcss.com) | v4（`@tailwindcss/postcss`） | 原子化 CSS |
| [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) | — | 自动优化 Geist 字体 |
| [ESLint](https://eslint.org) | 9.x | 代码质量检查 |

---

## 📁 目录结构

```
my-app/
├── app/
│   ├── layout.tsx              # 根布局（HTML 外壳 + 字体加载）
│   ├── page.tsx                # 首页（/）
│   ├── globals.css             # 全局样式（Tailwind v4 入口）
│   │
│   ├── api/
│   │   └── todos/
│   │       └── route.ts        # Todo 的 REST API（GET/POST/PUT/DELETE）
│   │
│   └── todos/
│       ├── layout.tsx          # 后台管理骨架（侧边栏 + 顶部栏）
│       ├── page.tsx            # Server Component — 拉取初始数据
│       └── TodoList.tsx        # Client Component — 交互与状态管理
│
├── public/                     # 静态资源（favicon、图标等）
├── package.json
├── postcss.config.mjs          # PostCSS + Tailwind v4 配置
├── next.config.ts              # Next.js 配置
├── tsconfig.json               # TypeScript 配置
└── eslint.config.mjs           # ESLint 9.x 配置
```

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18.17.0（Next.js 16 要求）
- npm / pnpm / yarn / bun

### 安装与启动

```bash
# 1. 进入项目目录
cd my-app

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器访问
#    首页:       http://localhost:3000
#    任务管理:   http://localhost:3000/todos
#    API 接口:   http://localhost:3000/api/todos
```

### 其他命令

```bash
npm run build      # 生产环境构建
npm run start      # 启动生产版本
npm run lint       # ESLint 代码检查
```

---

## 🧭 主要页面与路由

| 路由 | 页面/组件 | 类型 | 功能 |
|------|----------|------|------|
| `/` | [`app/page.tsx`](file:///c:/Users/86187/Desktop/2026面试/2026-06-15/next-dome/my-app/app/page.tsx) | Server Component | 项目介绍首页（含导航入口） |
| `/todos` | [`app/todos/page.tsx`](file:///c:/Users/86187/Desktop/2026面试/2026-06-15/next-dome/my-app/app/todos/page.tsx) + [`TodoList.tsx`](file:///c:/Users/86187/Desktop/2026面试/2026-06-15/next-dome/my-app/app/todos/TodoList.tsx) | Server + Client | 任务管理列表（后台管理风格） |
| `/api/todos` | [`app/api/todos/route.ts`](file:///c:/Users/86187/Desktop/2026面试/2026-06-15/next-dome/my-app/app/api/todos/route.ts) | Route Handler | REST API（内存存储，开发用） |

### API 使用示例

```bash
# 获取所有任务
curl http://localhost:3000/api/todos

# 新增任务
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "学习 Next.js 16"}'

# 切换完成状态（id 来自新增接口返回的数据）
curl -X PUT "http://localhost:3000/api/todos?id=1" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 删除任务
curl -X DELETE "http://localhost:3000/api/todos?id=1"
```

---

## 🏛 架构与设计亮点

### 1. Server + Client 混合架构（Next.js App Router 推荐模式）

```
 Server Component (page.tsx)
    └─ 直接 await fetch(".../api/todos") 拉取初始数据
    └─ 将数据作为 props 传给 Client Component

 Client Component (TodoList.tsx)
    └─ 用 "use client" 标记
    └─ useState 管理：输入框内容、筛选条件、当前列表、提交状态
    └─ 交互操作（增删改）继续通过 fetch 调用 API
    └─ useMemo 缓存派生数据（筛选后的列表、统计数字）
```

**好处：** 首屏数据在服务端准备好，无需 `useEffect + setState` 的级联渲染；所有 `setState` 都在用户事件处理函数（`onClick` / `onSubmit` / `onChange`）中调用，符合 React 19 的 ESLint 规则。

### 2. 统计与筛选：纯派生数据，不重复存储

```ts
const stats = useMemo(() => {
  const completed = todos.filter(t => t.completed).length;
  return { total: todos.length, completed, active: todos.length - completed };
}, [todos]);
```

筛选 / 搜索 / 统计都从 `todos` 单一数据源派生，避免状态不同步。

### 3. 后台管理骨架（`app/todos/layout.tsx`）

由 Next.js 的 **嵌套布局（Nested Layouts）** 机制实现——`/todos` 下所有页面自动继承侧边栏 + 顶部栏骨架，后续新增子页面只需写业务内容，不必重复布局代码。

### 4. 内联 SVG 图标（不依赖图标库）

所有图标（搜索、对勾、加号等）均使用内联 SVG，打包体积更轻；配合 Tailwind 的 `w-*/h-*` 尺寸与 `text-*` 颜色，可灵活控制。

---

## 📝 说明

- 本项目的 API 使用**进程内内存**存储任务数据，仅用于演示前后端交互。重启开发服务器后数据会清空。如需持久化，可将 `app/api/todos/route.ts` 中的存储逻辑替换为数据库（如 PostgreSQL、MongoDB、SQLite）。
- 样式基于 Tailwind CSS v4 的新 `@import "tailwindcss"` 与 `@theme { ... }` 语法，若需要迁移到 v3，可改为 `@tailwind base/components/utilities` 三指令。

---

## 📚 学习资源

- [Next.js 16 App Router 文档](https://nextjs.org/docs/app)
- [React 19 文档](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Route Handlers（API 路由）](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
