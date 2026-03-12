import Task from '@/components/Task';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

type TaskItem = {
  id: string;
  text: string;
  completed: boolean;
};

export default function HomeScreen() {
  const [task, setTask] = useState<string>('');
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);

  const handleAddTask = () => {
    const trimmed = task.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setTaskItems((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: trimmed,
        completed: false,
      },
    ]);
    setTask('');
  }

  const toggleTaskCompleted = (id: string) => {
    setTaskItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTaskItems((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <View className="flex-1">
      <View className="pt-20 px-5">
        <Text className="text-2xl font-bold">{"Today's tasks"}</Text>
 
        <View className="mt-[30px]">
          {/* This is where the tasks will go! */}
          {
            taskItems.map((item) => {
              return (
                <Task
                  key={item.id}
                  text={item.text}
                  completed={item.completed}
                  onToggleComplete={() => toggleTaskCompleted(item.id)}
                  onDelete={() => deleteTask(item.id)}
                />
              )
            })
          }
        </View>

      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        className="absolute bottom-[60px] w-full flex-row items-center justify-between pl-5 pr-[30px]"
      >
        <TextInput
          className="w-[290px] rounded-full border border-[#c0c0c0] bg-white px-[15px] py-[15px]"
          placeholder="Write a task"
          placeholderTextColor="#656262ff"
          value = {task}
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View className="h-[60px] w-[60px] items-center mr-[20px] justify-center rounded-full border border-[#c0c0c0] bg-white">
            <Text className="text-[#656262ff]">+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
