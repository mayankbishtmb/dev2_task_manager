import { useEffect, useMemo, useState } from 'react'
import './App.css'

const TASKS_STORAGE_KEY = 'task-manager-tasks'

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
      if (!savedTasks) {
        return []
      }

      const parsedTasks = JSON.parse(savedTasks)
      return Array.isArray(parsedTasks) ? parsedTasks : []
    } catch {
      return []
    }
  })
  const [taskTitle, setTaskTitle] = useState('')

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  )

  const remainingCount = tasks.length - completedCount

  const handleAddTask = (event) => {
    event.preventDefault()

    const title = taskTitle.trim()
    if (!title) {
      return
    }

    setTasks((currentTasks) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
      },
      ...currentTasks,
    ])
    setTaskTitle('')
  }

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }

  const clearCompletedTasks = () => {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
  }

  return (
    <main className="app-shell">
      <section className="task-card">
        <header>
          <p className="kicker">Simple React App</p>
          <h1>Task Manager</h1>
          <p className="subtitle">Plan your day and check things off as you go.</p>
        </header>

        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="Add a task"
            aria-label="Task title"
          />
          <button type="submit">Add</button>
        </form>

        <section className="stats" aria-label="Task statistics">
          <p>
            Total: <strong>{tasks.length}</strong>
          </p>
          <p>
            Remaining: <strong>{remainingCount}</strong>
          </p>
          <p>
            Completed: <strong>{completedCount}</strong>
          </p>
        </section>

        <ul className="task-list" aria-label="Task list">
          {tasks.length === 0 && (
            <li className="empty-state">No tasks yet. Add your first one above.</li>
          )}

          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={task.completed ? 'done' : ''}>{task.title}</span>
              </label>

              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.title}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="actions">
          <button
            type="button"
            className="clear-btn"
            onClick={clearCompletedTasks}
            disabled={completedCount === 0}
          >
            Clear Completed
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
