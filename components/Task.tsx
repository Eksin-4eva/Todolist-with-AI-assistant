import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type TaskProps = {
  text: string;
  completed: boolean;
  onToggleComplete: () => void;
  onDelete: () => void;
};

const Task = ({ text, completed, onToggleComplete, onDelete }: TaskProps) => {
  return (
    <View className="my-[5px] flex-row items-center justify-between rounded-[10px] bg-white p-[15px]">
      <View className="flex-1 flex-row items-center pr-4">
        <TouchableOpacity
          activeOpacity={0.7}
          className={`mr-[15px] h-6 w-6 items-center justify-center rounded-[5px] ${
            completed ? "bg-[#55BCF6]" : "bg-[#55BCF6]/40"
          }`}
          onPress={onToggleComplete}
        >
          {completed ? <Ionicons name="checkmark" size={16} color="#ffffff" /> : null}
        </TouchableOpacity>

        <Text className={`max-w-[80%] ${completed ? "text-neutral-500 line-through" : "text-black"}`}>
          {text}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityLabel={`Delete task ${text}`}
        className="h-4 w-4 items-center justify-center rounded-full border-2 border-[#55BCF6]"
        onPress={onDelete}
      >
        <Ionicons name="close" size={10} color="#55BCF6" />
      </TouchableOpacity>
    </View>
  );
};

export default Task;
