import { useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'Read a book',
      done: false,
      createdAt: '2026-04-19T09:00:00.000Z',
      dueDate: '2026-04-24',
      priority: 'medium',
    },
    {
      id: 2,
      text: 'Go for a walk',
      done: true,
      createdAt: '2026-04-20T14:30:00.000Z',
      dueDate: '',
      priority: 'low',
    },
    {
      id: 3,
      text: 'Write some code',
      done: false,
      createdAt: '2026-04-21T18:45:00.000Z',
      dueDate: '2026-04-22',
      priority: 'high',
    },
  ])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')

  const addTodo = () => {
    const text = input.trim()
    if (!text) return

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text,
        done: false,
        createdAt: new Date().toISOString(),
        dueDate: '',
        priority: 'medium',
      },
    ])
    setInput('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  // FR6: Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.done))
  }

  const priorityRank = {
    high: 3,
    medium: 2,
    low: 1,
  }

  const visible = todos
    .filter((t) =>
      filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
    )
    .slice()
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1

        const dueDiff =
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()

        if (dueDiff !== 0) return dueDiff
      }

      if (sortBy === 'priority') {
        const priorityDiff =
          (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0)

        if (priorityDiff !== 0) return priorityDiff
      }

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

  const remaining = todos.filter((t) => !t.done).length

  // Derived state (no new useState)
  const hasCompleted = todos.some((t) => t.done)

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
      filter === name
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`

  const priorityBadgeClass = (priority) =>
    `rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
      priority === 'high'
        ? 'bg-slate-800 text-white'
        : priority === 'medium'
          ? 'bg-slate-200 text-slate-700'
          : 'bg-slate-100 text-slate-500'
    }`

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={tabClass('all')}
              aria-pressed={filter === 'all'}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={tabClass('active')}
              aria-pressed={filter === 'active'}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={tabClass('completed')}
              aria-pressed={filter === 'completed'}
            >
              Completed
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Sort visible todos"
            >
              <option value="created">Date added</option>
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
            </select>
          </label>
        </div>

        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-1 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded ${
                  todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                <span className="block">{todo.text}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-xs not-italic no-underline">
                  <span className={priorityBadgeClass(todo.priority)}>
                    {todo.priority}
                  </span>
                  <span className="text-slate-400">
                    {todo.dueDate ? `Due ${todo.dueDate}` : 'No due date'}
                  </span>
                </span>
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-400 hover:text-red-500 text-lg font-bold px-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
                aria-label="Delete todo"
              >
                ×
              </button>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="text-center text-slate-400 py-4 text-sm">
              Nothing here.
            </li>
          )}
        </ul>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>
            {remaining} {remaining === 1 ? 'item' : 'items'} left
          </span>

          {hasCompleted && (
            <button
              onClick={clearCompleted}
              className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
              aria-label="Clear completed todos"
            >
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
