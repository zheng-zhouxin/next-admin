/*
 * @Description: 首页（路由 /）—— Server Component，展示项目介绍和导航
 * @Author: 郑周鑫
 * @Date: 2026-06-17
 */

import type { Metadata } from "next";
import Link from "next/link";

// SEO 元数据
export const metadata: Metadata = {
  title: "Next.js 16 示例项目",
  description: "基于 Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 构建的前端示例",
};

// 项目特性卡片的数据（Server Component 中可以直接定义常量）
const features = [
  {
    title: "App Router 文件路由",
    desc: "Next.js 13+ 的主流方案，app/xxx/page.tsx 自动对应路由 /xxx",
    icon: "🛣️",
  },
  {
    title: "数据请求与 API",
    desc: "Route Handlers（app/api/xxx/route.ts）模拟后端接口，前端通过 fetch 调用",
    icon: "📡",
  },
  {
    title: "组件状态管理",
    desc: "Client Component 中使用 useState、useEffect、useCallback 管理状态和副作用",
    icon: "🧠",
  },
  {
    title: "交互与表单",
    desc: "表单输入、按钮点击、checkbox 切换、列表筛选等完整前端交互",
    icon: "🎯",
  },
  {
    title: "Server + Client 混合",
    desc: "页面主体是 Server Component，交互逻辑用 'use client' 写在子组件中",
    icon: "🔀",
  },
  {
    title: "Tailwind CSS v4",
    desc: "新一代 CSS 框架，无需 webpack 配置，直接写 className 即可",
    icon: "🎨",
  },
];

export default function Home() {
  // 这是 Server Component，可以在这里做数据库查询、await fetch 等
  // 但它不能写 useState、onClick（那些要放在带 "use client" 的子组件里）

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 顶部 Hero 区 */}
        <section className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Next.js 16 · React 19 · TypeScript 5
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-4">
            前端练习项目
          </h1>
          <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            这是一个用于学习和演示 <span className="font-medium text-zinc-800">Next.js 最新特性</span> 的项目。
            包含数据请求、状态管理、API 路由、客户端交互等常见前端能力。
          </p>

          {/* 主操作按钮（内部导航用 Next.js 的 Link，做客户端路由，不刷新页面） */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/todos"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg transition-all"
            >
              查看 Todo 示例 →
            </Link>
            <a
              href="/api/todos"
              target="_blank"
              className="px-6 py-3 bg-white border border-zinc-300 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 hover:border-zinc-400 transition-all"
            >
              查看 API 响应
            </a>
          </div>
        </section>

        {/* 项目特性卡片 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-zinc-800 mb-6 text-center">项目包含的功能</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-5 bg-white rounded-xl border border-zinc-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-semibold text-zinc-800 mb-1">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 快速上手指引 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-zinc-800 mb-6 text-center">快速上手</h2>
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <ol className="space-y-3 text-zinc-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <span className="font-medium text-zinc-800">启动开发服务器：</span>
                  <code className="ml-2 px-2 py-0.5 bg-zinc-100 rounded text-sm font-mono">npm run dev</code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <span className="font-medium text-zinc-800">打开浏览器访问：</span>
                  <code className="ml-2 px-2 py-0.5 bg-zinc-100 rounded text-sm font-mono">http://localhost:3000</code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <span className="font-medium text-zinc-800">点击顶部「查看 Todo 示例」按钮体验交互功能</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <span className="font-medium text-zinc-800">生产构建：</span>
                  <code className="ml-2 px-2 py-0.5 bg-zinc-100 rounded text-sm font-mono">npm run build &amp;&amp; npm start</code>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* 技术栈一览 */}
        <section>
          <h2 className="text-xl font-bold text-zinc-800 mb-6 text-center">技术栈</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript 5",
              "Tailwind CSS v4",
              "App Router",
              "Route Handlers",
              "Server Components",
              "Client Components",
              "useState / useEffect",
              "fetch API",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-sm text-zinc-700 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* 底部版权 */}
        <footer className="mt-16 text-center text-xs text-zinc-400">
          <p>© 2026 · Next.js 练习项目 · 作者：郑周鑫</p>
        </footer>
      </div>
    </main>
  );
}
