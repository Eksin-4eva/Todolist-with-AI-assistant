import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Supabase Auth requires an email field, so we derive one from the username
  const toEmail = (u: string) => `${u.trim().toLowerCase()}@app.local`;

  const handleSubmit = async () => {
    const u = username.trim();
    const p = password.trim();
    if (!u || !p) return;

    setLoading(true);
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email: toEmail(u), password: p })
      : await supabase.auth.signUp({ email: toEmail(u), password: p });
    setLoading(false);

    if (error) Alert.alert('错误', error.message);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 items-center justify-center bg-white px-6"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text className="mb-8 text-3xl font-bold">
        {isLogin ? '欢迎回来' : '创建账号'}
      </Text>

      <TextInput
        className="mb-4 w-full rounded-xl border border-[#c0c0c0] px-4 py-4"
        placeholder="用户名"
        placeholderTextColor="#656262"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="mb-6 w-full rounded-xl border border-[#c0c0c0] px-4 py-4"
        placeholder="密码"
        placeholderTextColor="#656262"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="mb-4 w-full items-center rounded-xl bg-[#55BCF6] py-4"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-bold text-white">
            {isLogin ? '登录' : '注册'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin((v) => !v)}>
        <Text className="text-[#55BCF6]">
          {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
