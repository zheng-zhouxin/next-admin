/*
 * @Description: 任务管理页面 —— 路由 /todos
 *               这是一个 Server Component，负责拉取初始数据后传给 TodoList。
 *               页面外层的后台管理系统骨架由同目录下的 layout.tsx 负责。
 * @Author: 郑周鑫
 * @Date: 2026-06-17
 */

import type { Metadata } from "next";
import TodoList from "./TodoList";

export const metadata: Metadata = {
  title: "任务管理 · Next Admin",
  description: "基于 Next.js 16 的后台管理系统",
};

// ---------------------------------------------------------------------------
// 数据类型
// ---------------------------------------------------------------------------
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Server Component：直接 await 拉数据
// ---------------------------------------------------------------------------
async function getInitialTodos(): Promise<Todo[]> {
  try {
    const res = await fetch("http://localhost:3000/api/todos", { cache: "no-store" });
    const json = await res.json();
    return json.data || [];
  } catch {
    return [
      { id: 1, text: "学习 Next.js App Router", completed: true, createdAt: "2026-06-17 09:00" },
      { id: 2, text: "理解 Server Component 与 Client Component", completed: false, createdAt: "2026-06-17 09:30" },
      { id: 3, text: "练习数据请求与状态管理", completed: false, createdAt: "2026-06-17 10:00" },
    ];
  }
}

export default async function TodosPage() {
  const initialTodos = await getInitialTodos();

  // 这里的 children 会被 layout.tsx 中的 {children} 渲染到主内容区
  // 内容本身交给 TodoList（Client Component）处理
  return <TodoList initialTodos={initialTodos} />;
}
