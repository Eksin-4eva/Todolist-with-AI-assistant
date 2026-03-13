import Task from '@/components/Task';
import { supabase } from '@/lib/supabase';
import { useTodoStore } from '@/store/todoStore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [task, setTask] = useState<string>('');
  const { tasks, loading, fetchTasks, addTask, toggleTask, deleteTask } = useTodoStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    const trimmed = task.trim();
    if (!trimmed) return;
    Keyboard.dismiss();
    setTask('');
    await addTask(trimmed);
  };

  return (
    <View className="flex-1">
      <View className="pt-20 px-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold">今日待办</Text>
          <TouchableOpacity onPress={() => supabase.auth.signOut()}>
            <Text className="text-[#55BCF6]">退出登录</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-[30px]">
          {loading ? (
            <ActivityIndicator size="small" color="#55BCF6" />
          ) : (
            tasks.map((item) => (
              <Task
                key={item.id}
                text={item.text}
                completed={item.completed}
                onToggleComplete={() => toggleTask(item.id, item.completed)}
                onDelete={() => deleteTask(item.id)}
              />
            ))
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="absolute bottom-[60px] w-full flex-row items-center justify-between pl-5 pr-[30px]"
      >
        <TextInput
          className="w-[290px] rounded-full border border-[#c0c0c0] bg-white px-[15px] py-[15px]"
          placeholder="写下新任务"
          placeholderTextColor="#656262ff"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View className="h-[60px] w-[60px] items-center mr-[20px] justify-center rounded-full border border-[#c0c0c0] bg-white">
            <Text className="text-[#656262ff]">+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
