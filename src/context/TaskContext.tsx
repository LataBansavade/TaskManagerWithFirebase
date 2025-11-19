import React, { createContext, useContext, useState } from "react";

export interface Task {
  title: string;
  description: string;
  assignTo: string;
  priority: string;
  status: string;
  created: string;
  userId: string; // associate with user
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
  updateTask: (originalTask: Task, updatedTask: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => setTasks(prev => [...prev, task]);

  const deleteTask = (task: Task) => {
    setTasks(prev => prev.filter(t => t !== task));
  };

  const updateTask = (originalTask: Task, updatedTask: Task) => {
    setTasks(prev =>
      prev.map(t => (t === originalTask ? updatedTask : t))
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used within TaskProvider");
  return ctx;
};
