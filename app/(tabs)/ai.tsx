import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTodoStore } from '@/store/todoStore';
import { supabase } from '@/lib/supabase';

const QWEN_API_KEY = process.env.EXPO_PUBLIC_QWEN_API_KEY;
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

type Suggestion = {
  greeting: string;
  summary: string;
  actions: { id: string; action: 'complete' | 'delete'; reason: string }[];
};

export default function AIScreen() {
  const { tasks } = useTodoStore();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const analyze = async () => {
    if (tasks.length === 0) {
      Alert.alert('没有待办事项', '请先添加一些任务再进行分析。');
      return;
    }

    setLoading(true);
    try {
      const taskList = tasks
        .map((t, i) => `${i + 1}. [${t.completed ? '已完成' : '未完成'}] ${t.text} (id: ${t.id})`)
        .join('\n');

      const prompt = `你是一个任务管理助手。以下是用户的待办事项列表：

${taskList}

请分析这些任务，给出简短建议（2-3句话），并列出你建议执行的操作（标记完成或删除某些任务）。

必须以如下 JSON 格式回复，不要有任何其他内容：
{
  "greeting": "一句轻松自然的开场白，像朋友一样，可以适当幽默",
  "summary": "你的建议摘要",
  "actions": [
    { "id": "任务id", "action": "complete", "reason": "原因" },
    { "id": "任务id", "action": "delete", "reason": "原因" }
  ]
}

如果没有建议的操作，actions 为空数组。`;

      const res = await fetch(QWEN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${QWEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content ?? '';
      const parsed: Suggestion = JSON.parse(content);
      setSuggestion(parsed);
      setModalVisible(true);
    } catch (e) {
      Alert.alert('分析失败', '请检查网络或 API Key 配置。');
    } finally {
      setLoading(false);
    }
  };

  const applyActions = async () => {
    if (!suggestion) return;
    setModalVisible(false);

    for (const action of suggestion.actions) {
      if (action.action === 'complete') {
        await supabase.from('tasks').update({ completed: true }).eq('id', action.id);
      } else if (action.action === 'delete') {
        await supabase.from('tasks').delete().eq('id', action.id);
      }
    }

    // 刷新任务列表
    const { fetchTasks } = useTodoStore.getState();
    await fetchTasks();

    Alert.alert('完成', 'AI 建议已应用。');
    setSuggestion(null);
  };

  const dismiss = () => {
    setModalVisible(false);
    setSuggestion(null);
  };

  return (
    <View className="flex-1 pt-20 px-5">
      <Text className="text-2xl font-bold mb-2">AI 助手</Text>
      <Text className="text-gray-500 mb-8">
        分析你的 {tasks.length} 条待办事项，给出优化建议。
      </Text>

      <TouchableOpacity
        onPress={analyze}
        disabled={loading}
        className="bg-[#55BCF6] rounded-full py-4 items-center"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">开始分析</Text>
        )}
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text className="text-lg font-bold mb-3">AI 建议</Text>

            <ScrollView className="max-h-64 mb-4">
              {suggestion?.greeting && (
                <Text className="text-[#55BCF6] italic mb-3">{suggestion.greeting}</Text>
              )}
              <Text className="text-gray-700 mb-4">{suggestion?.summary}</Text>

              {suggestion?.actions && suggestion.actions.length > 0 && (
                <>
                  <Text className="font-semibold mb-2">建议操作：</Text>
                  {suggestion.actions.map((a) => {
                    const task = tasks.find((t) => t.id === a.id);
                    return (
                      <View key={a.id} className="mb-2 p-3 bg-gray-50 rounded-lg">
                        <Text className="font-medium">
                          {a.action === 'complete' ? '✅ 标记完成' : '🗑 删除'}：{task?.text ?? a.id}
                        </Text>
                        <Text className="text-gray-500 text-sm mt-1">{a.reason}</Text>
                      </View>
                    );
                  })}
                </>
              )}
            </ScrollView>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={dismiss}
                className="flex-1 border border-gray-300 rounded-full py-3 items-center"
              >
                <Text className="text-gray-600">否</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyActions}
                className="flex-1 bg-[#55BCF6] rounded-full py-3 items-center"
              >
                <Text className="text-white font-semibold">是</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
