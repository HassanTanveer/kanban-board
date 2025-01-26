import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, Button, Input } from './ui';
import { v4 as uuidv4 } from 'uuid';

// Updated Kanban Board for mobile responsiveness
// 1) We use Tailwind responsive utilities (e.g., grid-cols-1 vs. grid-cols-3)
// 2) flex-wrap and responsive sizing for input rows
// 3) The layout remains the same, but better adapts to small screens
// 4) Same localStorage-based data, tag/dueDate, filter logic, etc.

// Data model:
// { id: string, text: string, tag: string, dueDate: string, status: 'todo' | 'in-progress' | 'done' }

function getTagColor(tag) {
  const normalized = tag.trim().toLowerCase();
  switch (normalized) {
    case 'bug':
      return 'bg-red-100 text-red-800';
    case 'feature':
      return 'bg-blue-100 text-blue-800';
    case 'urgent':
      return 'bg-yellow-100 text-yellow-800';
    case 'design':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function KanbanBoard() {
  // States
  const [taskText, setTaskText] = useState('');
  const [taskTag, setTaskTag] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);

  // Filtering
  const [filterText, setFilterText] = useState('');
  const [filterTag, setFilterTag] = useState('');

  // Load tasks from local storage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('kanbanTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (!taskText.trim()) return;
    const newTask = {
      id: uuidv4(),
      text: taskText.trim(),
      tag: taskTag.trim() || 'General',
      dueDate: dueDate || '',
      status: 'todo',
    };
    setTasks([...tasks, newTask]);
    setTaskText('');
    setTaskTag('');
    setDueDate('');
  };

  // Update task status
  const updateTaskStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter logic
  const filteredTasks = tasks.filter((t) => {
    const matchesText = t.text.toLowerCase().includes(filterText.toLowerCase());
    const matchesTag = filterTag
      ? t.tag.toLowerCase() === filterTag.toLowerCase()
      : true;
    return matchesText && matchesTag;
  });

  // Helpers
  const getTasksByStatus = (status) =>
    filteredTasks.filter((t) => t.status === status);
  const todoCount = getTasksByStatus('todo').length;
  const inProgressCount = getTasksByStatus('in-progress').length;
  const doneCount = getTasksByStatus('done').length;

  const isOverdue = (task) => {
    if (!task.dueDate) return false;
    const now = new Date();
    const due = new Date(task.dueDate);
    return due < now && task.status !== 'done';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Kanban Board</h1>

      {/* Stats row - responsive */}
      <div className="mb-6 flex flex-wrap justify-center items-center gap-4 w-full max-w-screen-sm">
        <div className="p-2 rounded bg-white shadow w-24 text-center">
          <p className="text-gray-700 text-sm">To Do</p>
          <p className="text-xl font-semibold">{todoCount}</p>
        </div>
        <div className="p-2 rounded bg-white shadow w-24 text-center">
          <p className="text-gray-700 text-sm">In Progress</p>
          <p className="text-xl font-semibold">{inProgressCount}</p>
        </div>
        <div className="p-2 rounded bg-white shadow w-24 text-center">
          <p className="text-gray-700 text-sm">Done</p>
          <p className="text-xl font-semibold">{doneCount}</p>
        </div>
      </div>

      {/* Filter row - mobile-friendly */}
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap items-center gap-2">
        <Input
          className="w-full sm:w-64"
          placeholder="Filter by task text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <Input
          className="w-full sm:w-64"
          placeholder="Filter by tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
      </div>

      {/* Add task row - wrap for mobile */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 mb-8">
        <Input
          className="w-full sm:w-64"
          placeholder="Add a new task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <Input
          className="w-full sm:w-32"
          placeholder="Tag"
          value={taskTag}
          onChange={(e) => setTaskTag(e.target.value)}
        />
        <Input
          type="date"
          className="w-full sm:w-40"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
        >
          Add Task
        </Button>
      </div>

      {/* Main columns - 1 col on mobile, 3 on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        {/* TODO column */}
        <Card className="rounded-2xl">
          <CardHeader className="p-4">
            <h2 className="font-bold text-xl">To Do</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {getTasksByStatus('todo').map((task) => {
              const overdue = isOverdue(task);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className={`p-3 rounded-lg bg-white shadow flex items-center justify-between ${
                    overdue ? 'border border-red-300' : ''
                  }`}
                >
                  <div>
                    <span
                      className={`block font-semibold ${
                        overdue ? 'text-red-600' : ''
                      }`}
                    >
                      {task.text}
                    </span>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded mt-1 ${getTagColor(
                        task.tag
                      )}`}
                    >
                      {task.tag}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => updateTaskStatus(task.id, 'in-progress')}
                    >
                      Start
                    </Button>
                    <Button variant="destructive" onClick={() => deleteTask(task.id)}>
                      Delete
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* IN PROGRESS column */}
        <Card className="rounded-2xl">
          <CardHeader className="p-4">
            <h2 className="font-bold text-xl">In Progress</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {getTasksByStatus('in-progress').map((task) => {
              const overdue = isOverdue(task);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className={`p-3 rounded-lg bg-white shadow flex items-center justify-between ${
                    overdue ? 'border border-red-300' : ''
                  }`}
                >
                  <div>
                    <span
                      className={`block font-semibold ${
                        overdue ? 'text-red-600' : ''
                      }`}
                    >
                      {task.text}
                    </span>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded mt-1 ${getTagColor(
                        task.tag
                      )}`}
                    >
                      {task.tag}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => updateTaskStatus(task.id, 'todo')}
                    >
                      Back
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => updateTaskStatus(task.id, 'done')}
                    >
                      Finish
                    </Button>
                    <Button variant="destructive" onClick={() => deleteTask(task.id)}>
                      Delete
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* DONE column */}
        <Card className="rounded-2xl">
          <CardHeader className="p-4">
            <h2 className="font-bold text-xl">Done</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {getTasksByStatus('done').map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className="p-3 rounded-lg bg-white shadow flex items-center justify-between"
              >
                <div>
                  <span className="block font-semibold line-through text-gray-500">
                    {task.text}
                  </span>
                  {task.dueDate && (
                    <p className="text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded mt-1 opacity-70 ${getTagColor(
                      task.tag
                    )}`}
                  >
                    {task.tag}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                  >
                    Revert
                  </Button>
                  <Button variant="destructive" onClick={() => deleteTask(task.id)}>
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
