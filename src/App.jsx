import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardHeader, CardContent, Button, Input } from './ui';

// A fully self-contained Kanban Board React project.
// Demonstrates local storage, CRUD, and simple animations.
// No external APIs required.

// Data model for tasks
// { id: string, text: string, status: 'todo' | 'in-progress' | 'done' }

export default function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);

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

  // Add a new task to "To Do" column
  const addTask = () => {
    if (!taskText.trim()) return;
    const newTask = {
      id: uuidv4(),
      text: taskText,
      status: 'todo',
    };
    setTasks([...tasks, newTask]);
    setTaskText('');
  };

  // Update a task's status
  const updateTaskStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper function to get tasks by status
  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>

      {/* Task input */}
      <div className="flex items-center space-x-2 mb-8">
        <Input
          className="w-64"
          placeholder="Add a new task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <Button
          onClick={addTask}
          variant="blue"
        >
          Add Task
        </Button>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        {/* TODO Column */}
        <Card className="rounded-2xl">
          <CardHeader className="p-4">
            <h2 className="font-bold text-xl">To Do</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {getTasksByStatus('todo').map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className="p-3 rounded-lg bg-white shadow flex items-center justify-between"
              >
                <span>{task.text}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                  >
                    Start
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* IN PROGRESS Column */}
        <Card className="rounded-2xl">
          <CardHeader className="p-4">
            <h2 className="font-bold text-xl">In Progress</h2>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {getTasksByStatus('in-progress').map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className="p-3 rounded-lg bg-white shadow flex items-center justify-between"
              >
                <span>{task.text}</span>
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
                  <Button
                    variant="destructive"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* DONE Column */}
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
                <span className="line-through text-gray-500">
                  {task.text}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                  >
                    Revert
                  </Button>
                  <Button
                    variant="destructive"
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
