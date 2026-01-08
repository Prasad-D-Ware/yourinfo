import { View, Text, Pressable, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface PermissionStatus {
  location: string;
  backgroundLocation: string;
  motion: boolean;
}

export default function PermissionsScreen() {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    location: 'unknown',
    backgroundLocation: 'unknown',
    motion: false,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  async function checkPermissions() {
    const [locForeground, locBackground, motion] = await Promise.all([
      Location.getForegroundPermissionsAsync(),
      Location.getBackgroundPermissionsAsync(),
      Sensors.Accelerometer.isAvailableAsync(),
    ]);

    setPermissions({
      location: locForeground.status,
      backgroundLocation: locBackground.status,
      motion,
    });
  }

  async function requestLocationPermission() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissions(prev => ({ ...prev, location: status }));
  }

  async function requestBackgroundLocation() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await Location.requestBackgroundPermissionsAsync();
    setPermissions(prev => ({ ...prev, backgroundLocation: status }));
  }

  return (
    <Container className="bg-black">
      <Animated.View entering={FadeInDown.duration(600)} className="px-4 pt-6 pb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="shield-checkmark" size={28} color="#ec4899" />
          <Text className="text-white text-3xl font-black tracking-tight ml-3">
            PERMISSIONS
          </Text>
        </View>
        <Text className="text-gray-500 text-sm">
          What access does this app have to your device?
        </Text>
      </Animated.View>

      <View className="px-4 mt-4">
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <PermissionCard
            icon={<Ionicons name="location" size={28} color="#fff" />}
            title="Location Access"
            description="Used to show your position on the globe and detect your timezone"
            status={permissions.location}
            onRequest={requestLocationPermission}
            gradient={['#0891b2', '#06b6d4']}
            riskLevel="high"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)}>
          <PermissionCard
            icon={<Ionicons name="navigate" size={28} color="#fff" />}
            title="Background Location"
            description="Allows tracking your location even when app is closed"
            status={permissions.backgroundLocation}
            onRequest={requestBackgroundLocation}
            gradient={['#7c3aed', '#a855f7']}
            riskLevel="critical"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <PermissionCard
            icon={<MaterialCommunityIcons name="motion-sensor" size={28} color="#fff" />}
            title="Motion Sensors"
            description="Accelerometer, gyroscope, and other motion data"
            status={permissions.motion ? 'granted' : 'denied'}
            gradient={['#d97706', '#f59e0b']}
            riskLevel="medium"
          />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(400).duration(500)} className="px-4 mt-6">
        <Text className="text-gray-400 text-xs tracking-widest font-bold mb-3">PRIVACY RISK LEVELS</Text>
        <View className=" p-4 border border-gray-800">
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 rounded-full bg-red-500 mr-3" />
            <Text className="text-gray-300 text-sm flex-1">Critical - Can track you 24/7</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 rounded-full bg-orange-500 mr-3" />
            <Text className="text-gray-300 text-sm flex-1">High - Reveals precise location</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-yellow-500 mr-3" />
            <Text className="text-gray-300 text-sm flex-1">Medium - Can infer activities</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="px-4 mt-6 mb-6">
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Linking.openSettings();
          }}
          className="bg-gray-900/80 border border-gray-700  p-4 flex-row items-center justify-between active:opacity-70"
        >
          <View className="flex-row items-center">
            <Ionicons name="settings" size={22} color="#6b7280" />
            <Text className="text-gray-300 font-semibold ml-3">Open System Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </Pressable>
      </Animated.View>
    </Container>
  );
}

function PermissionCard({
  icon,
  title,
  description,
  status,
  onRequest,
  gradient,
  riskLevel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  onRequest?: () => void;
  gradient: [string, string];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}) {
  const isGranted = status === 'granted';
  const riskColors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
  };

  return (
    <View className="mb-4 overflow-hidden border border-gray-800 ">
      <View className="p-4">
        <View className="flex-row items-start">
          <View 
            className="w-14 h-14 rounded-xl items-center justify-center"
            style={{ backgroundColor: gradient[0] + '40' }}
          >
            {icon}
          </View>
          <View className="flex-1 ml-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-bold text-lg">{title}</Text>
              <View 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: riskColors[riskLevel] }}
              />
            </View>
            <Text className="text-gray-400 text-sm mt-1">{description}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <View className="flex-row items-center">
            <View 
              className={`w-2 h-2 rounded-full mr-2 ${
                isGranted ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <Text className={isGranted ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
              {isGranted ? 'GRANTED' : status === 'denied' ? 'DENIED' : 'NOT REQUESTED'}
            </Text>
          </View>
          
          {onRequest && !isGranted && (
            <Pressable
              onPress={onRequest}
              className="bg-white/10 px-4 py-2 rounded-xl active:bg-white/20"
            >
              <Text className="text-white font-semibold text-sm">Request</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
