import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type TaskItem = {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
};

type TodoStore = {
  tasks: TaskItem[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (text: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

export const useTodoStore = create<TodoStore>((set) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('[fetchTasks] user:', user?.id, 'userError:', userError);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: true });
    console.log('[fetchTasks] data:', data, 'error:', error);
    set({ tasks: data ?? [], loading: false });
  },

  addTask: async (text) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('[addTask] user:', user?.id, 'userError:', userError);
    const { error } = await supabase
      .from('tasks')
      .insert({ text, completed: false, user_id: user?.id });
    console.log('[addTask] insert error:', error);
    if (!error) {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });
      console.log('[addTask] refetch data:', data, 'fetchError:', fetchError);
      set({ tasks: data ?? [] });
    }
  },

  toggleTask: async (id, completed) => {
    const { data } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', id)
      .select()
      .single();
    if (data)
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? data : t)),
      }));
  },

  deleteTask: async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },
}));
