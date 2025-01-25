import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
// Example: If you store Card, CardHeader, CardContent, Button, Input in a single 'ui.jsx',
// just import them accordingly. Replace './ui' with your actual path:
import { Card, CardHeader, CardContent, Button, Input } from './ui';

// Updated Kanban Board with improved styling
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
  const [filterText, setFilterText] = useState('');
  const [filterTag, setFilterTag] = useState('');

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('kanbanTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (!taskText.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: uuidv4(),
        text: taskText.trim(),
        tag: taskTag.trim() || 'General',
        dueDate: dueDate || '',
        status: 'todo',
      },
    ]);
    setTaskText('');
    setTaskTag('');
    setDueDate('');
  };

  // Update status
  const updateTaskStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  // Delete task
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

  // Column helpers
  const getTasksByStatus = (status) => filteredTasks.filter((t) => t.status === status);
  const todoCount = getTasksByStatus('todo').length;
  const inProgressCount = getTasksByStatus('in-progress').length;
  const doneCount = getTasksByStatus('done').length;

  // Overdue check
  const isOverdue = (task) => {
    if (!task.dueDate) return false;
    const now = new Date();
    const due = new Date(task.dueDate);
    return due < now && task.status !== 'done';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-100 to-slate-50 flex flex-col items-center py-8 px-4">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 tracking-wide text-gray-800">
        Kanban Board
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 max-w-md w-full mb-8">
        <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-sm text-gray-500">To Do</h2>
          <p className="text-2xl font-semibold text-gray-800">{todoCount}</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-sm text-gray-500">In Progress</h2>
          <p className="text-2xl font-semibold text-gray-800">{inProgressCount}</p>
        </div>
        <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-sm text-gray-500">Done</h2>
          <p className="text-2xl font-semibold text-gray-800">{doneCount}</p>
        </div>
      </div>

      {/* Filter Row */}
      <Card className="w-full max-w-3xl mb-6">
        <CardHeader className="p-4 border-b">
          <h2 className="font-semibold text-lg text-gray-800">Filters</h2>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row">
          <Input
            className="md:w-auto w-full"
            placeholder="Filter by task text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <Input
            className="md:w-auto w-full"
            placeholder="Filter by tag"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Add Task Row */}
      <Card className="w-full max-w-3xl mb-8">
        <CardHeader className="p-4 border-b">
          <h2 className="font-semibold text-lg text-gray-800">Add a New Task</h2>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row">
          <Input
            className="md:flex-1"
            placeholder="Task description..."
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <Input
            className="md:w-40 w-full"
            placeholder="Tag"
            value={taskTag}
            onChange={(e) => setTaskTag(e.target.value)}
          />
          <Input
            type="date"
            className="md:w-44 w-full"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Task
          </Button>
        </CardContent>
      </Card>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* TODO Column */}
        <Card className="rounded-xl bg-white shadow-lg">
          <CardHeader className="p-4 border-b">
            <h2 className="font-bold text-xl text-gray-800">To Do</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {getTasksByStatus('todo').map((task) => {
              const overdue = isOverdue(task);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className={`p-4 rounded-md bg-white shadow flex items-center justify-between border ${
                    overdue ? 'border-red-300' : 'border-transparent'
                  }`}
                >
                  <div className="mr-4">
                    <div
                      className={`font-semibold mb-1 ${
                        overdue ? 'text-red-600' : 'text-gray-800'
                      }`}
                    >
                      {task.text}
                    </div>
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="px-2 py-1 text-sm"
                      onClick={() => updateTaskStatus(task.id, 'in-progress')}
                    >
                      Start
                    </Button>
                    <Button
                      variant="destructive"
                      className="px-2 py-1 text-sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* IN PROGRESS Column */}
        <Card className="rounded-xl bg-white shadow-lg">
          <CardHeader className="p-4 border-b">
            <h2 className="font-bold text-xl text-gray-800">In Progress</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {getTasksByStatus('in-progress').map((task) => {
              const overdue = isOverdue(task);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className={`p-4 rounded-md bg-white shadow flex items-center justify-between border ${
                    overdue ? 'border-red-300' : 'border-transparent'
                  }`}
                >
                  <div className="mr-4">
                    <div
                      className={`font-semibold mb-1 ${
                        overdue ? 'text-red-600' : 'text-gray-800'
                      }`}
                    >
                      {task.text}
                    </div>
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="px-2 py-1 text-sm"
                      onClick={() => updateTaskStatus(task.id, 'todo')}
                    >
                      Back
                    </Button>
                    <Button
                      variant="outline"
                      className="px-2 py-1 text-sm"
                      onClick={() => updateTaskStatus(task.id, 'done')}
                    >
                      Finish
                    </Button>
                    <Button
                      variant="destructive"
                      className="px-2 py-1 text-sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* DONE Column */}
        <Card className="rounded-xl bg-white shadow-lg">
          <CardHeader className="p-4 border-b">
            <h2 className="font-bold text-xl text-gray-800">Done</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {getTasksByStatus('done').map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className="p-4 rounded-md bg-white shadow flex items-center justify-between border border-transparent"
              >
                <div className="mr-4">
                  <div className="font-semibold mb-1 line-through text-gray-500">
                    {task.text}
                  </div>
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="px-2 py-1 text-sm"
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                  >
                    Revert
                  </Button>
                  <Button
                    variant="destructive"
                    className="px-2 py-1 text-sm"
                    onClick={() => deleteTask(task.id)}
                  >
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
