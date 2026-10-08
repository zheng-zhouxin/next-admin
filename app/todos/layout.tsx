/*
 * @Description: 后台管理系统布局（Server Component）
 *               包含：左侧固定侧边栏 + 顶部栏 + 主内容区
 *               所有 /todos/* 路由都会共享这个布局
 * @Author: 郑周鑫
 * @Date: 2026-06-17
 */

import type { ReactNode } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// 左侧导航菜单：模仿企业后台管理系统的菜单结构
// ---------------------------------------------------------------------------

const MENU = [
  {
    group: "运营",
    items: [
      { key: "dashboard", label: "工作台", icon: "📊", href: "/todos", active: true },
      { key: "tasks", label: "任务管理", icon: "📝", href: "/todos" },
    ],
  },
  {
    group: "系统",
    items: [
      { key: "users", label: "用户管理", icon: "👥", href: "/todos" },
      { key: "stats", label: "数据统计", icon: "📈", href: "/todos" },
      { key: "settings", label: "系统设置", icon: "🔧", href: "/todos" },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// 根布局组件：返回页面骨架
// ---------------------------------------------------------------------------

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#1f2937]">
      {/* 两栏布局：左侧 240px + 右侧自适应 */}
      <div className="flex min-h-screen">
        {/* ========== 左侧边栏 ========== */}
        <aside className="w-60 bg-[#001529] text-zinc-200 flex flex-col flex-shrink-0">
          {/* Logo 区 */}
          <Link
            href="/todos"
            className="h-14 flex items-center justify-center gap-2 border-b border-white/10 hover:bg-white/5 transition-colors"
          >
            <span className="text-xl">⚡</span>
            <span className="font-semibold tracking-wide text-white">Next Admin</span>
          </Link>

          {/* 菜单项 */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {MENU.map((group) => (
              <div key={group.group} className="mb-4">
                <div className="px-5 mb-2 text-[11px] uppercase tracking-wider text-zinc-500">
                  {group.group}
                </div>
                {group.items.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-300 hover:bg-blue-500/10 hover:text-white transition-colors"
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          {/* 底部版本号 */}
          <div className="px-5 py-4 border-t border-white/10 text-[11px] text-zinc-500">
            v1.0.0 · Next.js 16
          </div>
        </aside>

        {/* ========== 右侧：顶部栏 + 页面内容 ========== */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* ---------- 顶部栏 ---------- */}
          <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 flex-shrink-0">
            {/* 左：面包屑 */}
            <div className="flex items-center text-sm text-zinc-500">
              <span>首页</span>
              <span className="mx-2 text-zinc-300">/</span>
              <span>运营</span>
              <span className="mx-2 text-zinc-300">/</span>
              <span className="text-zinc-800 font-medium">任务管理</span>
            </div>

            {/* 右：搜索 + 用户 */}
            <div className="flex items-center gap-4">
              {/* 搜索框 */}
              <div className="relative">
                <svg
                  className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="搜索菜单/功能..."
                  className="w-56 pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
              </div>

              {/* 用户信息 */}
              <div className="flex items-center gap-2 pl-4 border-l border-zinc-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-medium">
                  管
                </div>
                <div className="text-sm">
                  <div className="font-medium text-zinc-800 leading-tight">管理员</div>
                  <div className="text-xs text-zinc-400">admin@example.com</div>
                </div>
              </div>
            </div>
          </header>

          {/* ---------- 页面内容区 ---------- */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
