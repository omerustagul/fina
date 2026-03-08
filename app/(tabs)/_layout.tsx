import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useRouter, withLayoutContext } from 'expo-router';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary.deep }}>
      <MaterialTopTabs
        tabBarPosition="bottom"
        tabBar={(props) => (
          <View style={[styles.floatingTabBarContainer, {
            bottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 12),
            shadowColor: isDark ? '#000' : colors.primary.brand,
            shadowOpacity: isDark ? 0.6 : 0.2
          }]}>
            {/* Glass Effect Layer */}
            {Platform.OS === 'ios' ? (
              <BlurView
                tint={isDark ? "dark" : "light"}
                intensity={30}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, {
                backgroundColor: isDark ? 'rgba(12, 0, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)'
              }]} />
            )}

            {/* Subtle Inner Glow/Border */}
            <View style={[StyleSheet.absoluteFill, {
              borderRadius: 28,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(108, 60, 225, 0.12)',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(108, 60, 225, 0.03)'
            }]} pointerEvents="none" />

            <View style={styles.tabBarInner}>
              {props.state.routes.map((route, index) => {
                const { options } = props.descriptors[route.key];
                const isFocused = props.state.index === index;

                const onPress = () => {
                  const event = props.navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    props.navigation.navigate(route.name);
                  }
                };

                const color = isFocused
                  ? colors.accent.teal
                  : (isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(26, 5, 51, 0.4)');

                const Icon = options.tabBarIcon as any;

                return (
                  <React.Fragment key={route.key}>
                    {index === 2 && (
                      <Pressable
                        style={styles.centerBtn}
                        onPress={() => router.push('/modals/quick-menu' as any)}
                        android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true }}
                      >
                        <Ionicons name="apps" size={24} color="#FFF" />
                      </Pressable>
                    )}
                    <Pressable
                      onPress={onPress}
                      style={styles.tabItem}
                      android_ripple={{ color: `${colors.accent.teal}20`, borderless: true }}
                    >
                      <View style={isFocused ? [styles.activeIconBg, { backgroundColor: `${colors.accent.teal}15` }] : null}>
                        {Icon && <Icon color={color} size={20} />}
                      </View>
                      <Text style={[styles.tabLabel, {
                        color,
                        fontFamily: isFocused ? FONTS.family.bold : FONTS.family.medium,
                        fontWeight: isFocused ? '600' : '500'
                      }]} numberOfLines={1}>
                        {options.title}
                      </Text>
                    </Pressable>
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        )}
        screenOptions={{
          tabBarIndicatorStyle: { height: 0 },
        }}
      >
        <MaterialTopTabs.Screen name="index" options={{ title: 'Genel', tabBarIcon: ({ color }: any) => <Ionicons name="apps" size={20} color={color} /> }} />
        <MaterialTopTabs.Screen name="transactions" options={{ title: 'İşlem', tabBarIcon: ({ color }: any) => <Ionicons name="receipt" size={20} color={color} /> }} />
        <MaterialTopTabs.Screen name="analytics" options={{ title: 'Analiz', tabBarIcon: ({ color }: any) => <Ionicons name="pie-chart" size={20} color={color} /> }} />
        <MaterialTopTabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({ color }: any) => <Ionicons name="person-circle" size={20} color={color} /> }} />
      </MaterialTopTabs>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingTabBarContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 72,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    zIndex: 100,
  },
  tabBarInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 4,
  },
  centerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D09E',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#00D09E',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  activeIconBg: {
    padding: 8,
    borderRadius: 16,
    marginBottom: -4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 6,
    textTransform: 'none',
  },
});
