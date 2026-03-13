import { create } from 'zustand';

type TaskItem = {
  id: string;
  text: string;
  completed: boolean;
};

type TodoStore = {
  tasks: TaskItem[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

export const useTodoStore = create<TodoStore>((set) => ({
  tasks: [],

  addTask: (text) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          text,
          completed: false,
        },
      ],
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
}));
