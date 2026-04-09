import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'goal-manager.tasks';

function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = window.localStorage.getItem(STORAGE_KEY);
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const stats = useMemo(() => {
    const completed = tasks.filter(task => task.done).length;
    return {
      total: tasks.length,
      completed,
      active: tasks.length - completed,
    };
  }, [tasks]);

  const addTask = event => {
    event.preventDefault();

    const trimmed = taskText.trim();
    if (!trimmed) return;

    setTasks(prev => [...prev, { id: Date.now(), text: trimmed, done: false }]);
    setTaskText('');
  };

  const toggleDone = id => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.done));
  };

  return (
    <section className="task-manager">
      <header className="task-manager__header">
        <p className="task-manager__eyebrow">Simple planner</p>
        <h1>Task Manager</h1>
        <p className="task-manager__subtitle">Capture tasks, mark progress, and keep the list tidy.</p>
      </header>

      <div className="task-manager__stats" aria-label="Task summary">
        <div>
          <span>{stats.total}</span>
          <label>Total</label>
        </div>
        <div>
          <span>{stats.active}</span>
          <label>Active</label>
        </div>
        <div>
          <span>{stats.completed}</span>
          <label>Done</label>
        </div>
      </div>

      <form className="task-manager__form" onSubmit={addTask}>
        <input
          value={taskText}
          onChange={e => setTaskText(e.target.value)}
          placeholder="Add a new task"
          aria-label="Task name"
        />
        <button type="submit">Add task</button>
      </form>

      <div className="task-manager__actions">
        <button type="button" onClick={clearCompleted} disabled={!stats.completed}>
          Clear completed
        </button>
      </div>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={task.done ? 'task-list__item task-list__item--done' : 'task-list__item'}>
            <button type="button" className="task-list__toggle" onClick={() => toggleDone(task.id)}>
              <span className="task-list__checkbox" aria-hidden="true" />
              <span>{task.text}</span>
            </button>
            <div className="task-list__controls">
              <button type="button" onClick={() => toggleDone(task.id)}>
                {task.done ? 'Undo' : 'Done'}
              </button>
              <button type="button" className="task-list__delete" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && <p className="task-manager__empty">No tasks yet. Add one above.</p>}
    </section>
  );
}

export default TaskManager;
