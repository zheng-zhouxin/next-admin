/*
 * @Description: Todo 列表的后端 API 路由 —— 使用 Next.js 的 Route Handlers
 *               在 Next.js 13+ 的 App Router 中，app/api/xxx/route.ts 自动对应 /api/xxx
 * @Author: 郑周鑫
 * @Date: 2026-06-17
 */

import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// 数据存储（简易版：用一个模块级的 Map 代替数据库，服务重启后会重置）
// 说明：真实项目中这里应该换成数据库（如 MySQL/MongoDB/Postgres + Prisma）
// ---------------------------------------------------------------------------

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

let todoStore: Todo[] = [
  { id: 1, text: "学习 Next.js App Router", completed: true, createdAt: "2026-06-17 09:00" },
  { id: 2, text: "理解 Server Component 与 Client Component", completed: false, createdAt: "2026-06-17 09:30" },
  { id: 3, text: "练习数据请求与状态管理", completed: false, createdAt: "2026-06-17 10:00" },
];

let nextId = 4;

// ---------------------------------------------------------------------------
// GET /api/todos —— 获取 Todo 列表
// ---------------------------------------------------------------------------
export async function GET() {
  // 模拟 200ms 网络延迟，让前端能看到 loading 状态
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json(
    { code: 0, message: "success", data: todoStore },
    { status: 200 }
  );
}

// ---------------------------------------------------------------------------
// POST /api/todos —— 新增一条 Todo
// 请求体：{ text: string }
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || !text.trim()) {
    return NextResponse.json(
      { code: 1, message: "内容不能为空" },
      { status: 400 }
    );
  }

  const newTodo: Todo = {
    id: nextId++,
    text: text.trim(),
    completed: false,
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
  };

  todoStore = [newTodo, ...todoStore]; // 新的放在前面

  return NextResponse.json(
    { code: 0, message: "创建成功", data: newTodo },
    { status: 201 }
  );
}

// ---------------------------------------------------------------------------
// PUT /api/todos/:id —— 切换一条 Todo 的完成状态
// 请求体：{ completed: boolean } （传 id 用 URL 动态路由，这里用 query 简化）
// 说明：这里为了演示，使用 query 参数传递 id：PUT /api/todos?id=1
// ---------------------------------------------------------------------------
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const { completed } = await request.json();

  if (!id) {
    return NextResponse.json(
      { code: 1, message: "缺少 id 参数" },
      { status: 400 }
    );
  }

  const target = todoStore.find((t) => t.id === id);
  if (!target) {
    return NextResponse.json(
      { code: 1, message: "找不到该 Todo" },
      { status: 404 }
    );
  }

  target.completed = completed;

  return NextResponse.json(
    { code: 0, message: "更新成功", data: target },
    { status: 200 }
  );
}

// ---------------------------------------------------------------------------
// DELETE /api/todos?id=1 —— 删除一条 Todo
// ---------------------------------------------------------------------------
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json(
      { code: 1, message: "缺少 id 参数" },
      { status: 400 }
    );
  }

  const before = todoStore.length;
  todoStore = todoStore.filter((t) => t.id !== id);
  const deleted = before > todoStore.length;

  if (!deleted) {
    return NextResponse.json(
      { code: 1, message: "找不到该 Todo" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { code: 0, message: "删除成功" },
    { status: 200 }
  );
}
