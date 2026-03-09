import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/stores/themeStore';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, useFonts } from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-Bold': DMSans_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { isDark, colors } = useTheme();
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="register" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="modals/add-transaction" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modals/add-voice" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modals/add-scan" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modals/quick-menu" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modals/add-category" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modals/add-reminder" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modals/add-card" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modals/card-detail" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modals/payment-plan" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modals/ai-chat" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="modals/edit-profile" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="modals/help-center" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="goals" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="reminders" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="cards" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="settings/index" options={{ presentation: 'card', title: 'Ayarlar', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
