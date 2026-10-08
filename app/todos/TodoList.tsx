/*
 * @Description: 任务管理列表 —— 后台管理系统风格（Client Component）
 *               包含：统计卡片 + 操作栏（搜索/筛选/新增） + 数据表格
 *               所有 setState 均在用户事件处理函数中调用，符合 React 19 规范
 * @Author: 郑周鑫
 * @Date: 2026-06-17
 */

"use client";

import { useState, useMemo } from "react";

// ---------------------------------------------------------------------------
// 类型
// ---------------------------------------------------------------------------

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

interface TodoListProps {
  initialTodos: Todo[];
}

// ---------------------------------------------------------------------------
// 主组件
// ---------------------------------------------------------------------------

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [keyword, setKeyword] = useState("");

  // ---------- 新增 ----------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json: ApiResponse<Todo> = await res.json();
      if (json.code === 0 && json.data) {
        setTodos((prev) => [json.data!, ...prev]);
        setInput("");
      }
    } catch (err) {
      console.error("创建失败", err);
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- 切换完成状态 ----------
  async function handleToggle(id: number, completed: boolean) {
    const prev = todos;
    setTodos((t) => t.map((x) => (x.id === id ? { ...x, completed } : x)));
    try {
      const res = await fetch(`/api/todos?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error("请求失败");
    } catch {
      setTodos(prev);
    }
  }

  // ---------- 删除 ----------
  async function handleDelete(id: number) {
    const prev = todos;
    setTodos((t) => t.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/todos?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("请求失败");
    } catch {
      setTodos(prev);
    }
  }

  // ---------- 批量清除已完成 ----------
  function handleClearCompleted() {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    setTodos((t) => t.filter((x) => !x.completed));
    completedIds.forEach((id) => handleDelete(id));
  }

  // ---------- 派生数据 ----------
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, rate };
  }, [todos]);

  const visibleTodos = useMemo(() => {
    let list = todos;
    if (filter === "active") list = list.filter((t) => !t.completed);
    else if (filter === "completed") list = list.filter((t) => t.completed);
    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase();
      list = list.filter((t) => t.text.toLowerCase().includes(k));
    }
    return list;
  }, [todos, filter, keyword]);

  // ==========================================================================
  // 渲染
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* ---------- 页面标题 ---------- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-800">任务管理</h1>
          <p className="text-sm text-zinc-500 mt-0.5">查看、编辑和管理所有待办任务</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          数据已同步
        </div>
      </div>

      {/* ---------- 统计卡片 ---------- */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="任务总数"
          value={stats.total}
          icon="📋"
          color="blue"
        />
        <StatCard
          label="进行中"
          value={stats.active}
          icon="⏳"
          color="amber"
        />
        <StatCard
          label="已完成"
          value={stats.completed}
          icon="✅"
          color="emerald"
        />
        <StatCard
          label="完成率"
          value={`${stats.rate}%`}
          icon="📈"
          color="violet"
          progress={stats.rate}
        />
      </div>

      {/* ---------- 操作区 + 新增 + 表格（合并为一个卡片） ---------- */}
      <div className="bg-white rounded-md shadow-sm border border-zinc-200">
        {/* 顶部工具条 */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            {/* 搜索 */}
            <div className="relative">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                type="text"
                placeholder="搜索任务内容..."
                className="w-64 pl-8 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
              />
            </div>

            {/* 筛选 Tab */}
            <div className="flex items-center bg-zinc-50 rounded border border-zinc-200 p-0.5">
              {(
                [
                  { key: "all", label: "全部" },
                  { key: "active", label: "进行中" },
                  { key: "completed", label: "已完成" },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    filter === item.key
                      ? "bg-white text-blue-600 shadow-sm font-medium"
                      : "text-zinc-600 hover:text-zinc-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {todos.some((t) => t.completed) && (
              <button
                onClick={handleClearCompleted}
                className="px-3 py-2 text-sm text-zinc-600 border border-zinc-200 rounded hover:bg-zinc-50 transition-colors"
              >
                清除已完成
              </button>
            )}
            <button
              onClick={() => {
                // 点击"新增"时聚焦输入框（见下方表单）
                const el = document.getElementById("todo-input");
                el?.focus();
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新增任务
            </button>
          </div>
        </div>

        {/* 新增表单行 */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 bg-zinc-50/50 border-b border-zinc-100">
          <input
            id="todo-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入任务内容，按回车或点击右侧按钮添加..."
            className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !input.trim()}
            className="px-4 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                添加中
              </>
            ) : (
              "确认添加"
            )}
          </button>
        </form>

        {/* 数据表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <th className="px-6 py-3 w-16">ID</th>
                <th className="px-6 py-3">任务内容</th>
                <th className="px-6 py-3 w-28">状态</th>
                <th className="px-6 py-3 w-40">创建时间</th>
                <th className="px-6 py-3 w-32 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {visibleTodos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl opacity-20">📭</div>
                      <div className="text-zinc-500 text-sm">暂无数据</div>
                      <div className="text-zinc-400 text-xs">
                        {keyword ? "试试调整搜索关键词" : "点击右上角「新增任务」开始"}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                visibleTodos.map((todo, index) => (
                  <tr
                    key={todo.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-zinc-400 font-mono text-xs">
                      #{String(index + 1).padStart(3, "0")}
                    </td>
                    <td
                      className={`px-6 py-3.5 ${
                        todo.completed ? "text-zinc-400 line-through" : "text-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(todo.id, !todo.completed)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            todo.completed
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-zinc-300 hover:border-blue-500"
                          }`}
                          aria-label="切换完成状态"
                        >
                          {todo.completed && (
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <span>{todo.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      {todo.completed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          已完成
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          进行中
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-zinc-500 font-mono text-xs">
                      {todo.createdAt}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggle(todo.id, !todo.completed)}
                          className="px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          {todo.completed ? "重新打开" : "标记完成"}
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 表格底部信息条 */}
        <div className="flex items-center justify-between px-6 py-3 bg-zinc-50/50 border-t border-zinc-100 text-xs text-zinc-500">
          <span>
            共 <span className="text-zinc-700 font-medium">{visibleTodos.length}</span> 条记录
            {keyword && <> · 搜索「<span className="text-zinc-700">{keyword}</span>」</>}
          </span>
          <span className="font-mono">Next Admin · 后台管理系统</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// 子组件：统计卡片
// ==========================================================================

type StatColor = "blue" | "amber" | "emerald" | "violet";

function StatCard({
  label,
  value,
  icon,
  color,
  progress,
}: {
  label: string;
  value: number | string;
  icon: string;
  color: StatColor;
  progress?: number;
}) {
  const colorMap: Record<StatColor, { bg: string; text: string; bar: string; ring: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-500", ring: "ring-blue-500/10" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500", ring: "ring-amber-500/10" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500", ring: "ring-emerald-500/10" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", bar: "bg-violet-500", ring: "ring-violet-500/10" },
  };
  const c = colorMap[color];

  return (
    <div className="bg-white rounded-md shadow-sm border border-zinc-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-zinc-500">{label}</div>
          <div className="text-2xl font-semibold text-zinc-800 mt-1">{value}</div>
        </div>
        <div className={`w-9 h-9 rounded-lg ${c.bg} ${c.text} flex items-center justify-center text-lg ring-1 ${c.ring}`}>
          {icon}
        </div>
      </div>
      {typeof progress === "number" && (
        <div className="mt-2">
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${c.bar} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
