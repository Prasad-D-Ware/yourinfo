import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sensors from 'expo-sensors';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Divider } from 'heroui-native';
import { ThemeToggle } from '@/components/theme-toggle';

interface SensorAvailability {
  accelerometer: boolean;
  gyroscope: boolean;
  magnetometer: boolean;
  barometer: boolean;
  pedometer: boolean;
  deviceMotion: boolean;
}

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

export default function SensorsScreen() {
  const [availability, setAvailability] = useState<SensorAvailability>({
    accelerometer: false,
    gyroscope: false,
    magnetometer: false,
    barometer: false,
    pedometer: false,
    deviceMotion: false,
  });
  const [accelData, setAccelData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });
  const [gyroData, setGyroData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    async function checkSensors() {
      const [accel, gyro, mag, baro, pedo, motion] = await Promise.all([
        Sensors.Accelerometer.isAvailableAsync(),
        Sensors.Gyroscope.isAvailableAsync(),
        Sensors.Magnetometer.isAvailableAsync(),
        Sensors.Barometer.isAvailableAsync(),
        Sensors.Pedometer.isAvailableAsync(),
        Sensors.DeviceMotion.isAvailableAsync(),
      ]);
      setAvailability({
        accelerometer: accel,
        gyroscope: gyro,
        magnetometer: mag,
        barometer: baro,
        pedometer: pedo,
        deviceMotion: motion,
      });
    }
    checkSensors();

    Sensors.Accelerometer.setUpdateInterval(100);
    const accelSub = Sensors.Accelerometer.addListener(setAccelData);
    
    Sensors.Gyroscope.setUpdateInterval(100);
    const gyroSub = Sensors.Gyroscope.addListener(setGyroData);

    return () => {
      accelSub.remove();
      gyroSub.remove();
    };
  }, []);

  return (
    <Container className="bg-black">
      <Animated.View entering={FadeInDown.duration(600)} className="px-4 pt-6 pb-4">
        <View className="flex-row items-center mb-2">
          <MaterialCommunityIcons name="motion-sensor" size={28} color="#a855f7" />
          <Text className="text-white text-3xl font-black tracking-tight ml-3">
            SENSORS
          </Text>
        </View>
        <Text className="text-gray-500 text-sm">
          Real-time motion and environmental data from your device
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)} className="px-4 mt-4">
        <SectionTitle title="ACCELEROMETER (LIVE)" color="#22d3ee" />
        <View className=" overflow-hidden border p-1">
          <LinearGradient
            colors={['#000', '#000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4"
          >
            <View className="flex-row justify-between">
              <AxisDisplay label="X" value={accelData.x} />
              <AxisDisplay label="Y" value={accelData.y} />
              <AxisDisplay label="Z" value={accelData.z} />
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(500)} className="px-4 mt-4">
        <SectionTitle title="GYROSCOPE (LIVE)" color="#a855f7" />
        <View className=" overflow-hidden border  p-1">
          <LinearGradient
              colors={['#000', '#000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4"
          >
            <View className="flex-row justify-between">
              <AxisDisplay label="X" value={gyroData.x} />
              <AxisDisplay label="Y" value={gyroData.y} />
              <AxisDisplay label="Z" value={gyroData.z} />
            </View>
          </LinearGradient>
        </View>
      </Animated.View>


      <Animated.View entering={FadeInUp.delay(300).duration(500)} className="px-4 mt-6">
        <SectionTitle title="SENSOR AVAILABILITY" color="#f59e0b" />
        <View className="flex-row flex-wrap gap-3">
          <SensorCard
            icon={<MaterialCommunityIcons name="run-fast" size={24} color="#fff" />}
            name="Accelerometer"
            available={availability.accelerometer}
          />
          <SensorCard
            icon={<MaterialCommunityIcons name="rotate-3d-variant" size={24} color="#fff" />}
            name="Gyroscope"
            available={availability.gyroscope}
          />
          <SensorCard
            icon={<MaterialCommunityIcons name="compass" size={24} color="#fff" />}
            name="Magnetometer"
            available={availability.magnetometer}
          />
          <SensorCard
            icon={<MaterialCommunityIcons name="gauge" size={24} color="#fff" />}
            name="Barometer"
            available={availability.barometer}
          />
          <SensorCard
            icon={<MaterialCommunityIcons name="shoe-print" size={24} color="#fff" />}
            name="Pedometer"
            available={availability.pedometer}
          />
          <SensorCard
            icon={<MaterialCommunityIcons name="motion" size={24} color="#fff" />}
            name="Device Motion"
            available={availability.deviceMotion}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(500)} className="px-4 mt-8 mb-6">
        <View className="bg-amber-500/10 border border-amber-500/30  p-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#f59e0b" />
            <Text className="text-amber-400 font-bold ml-2">Sensor Data Usage</Text>
          </View>
          <Text className="text-gray-400 text-sm leading-5">
            Motion sensors can be used to track your activities, gestures, 
            and even infer sensitive information like PIN codes you type.
          </Text>
        </View>
      </Animated.View>
    </Container>
  );
}

function SectionTitle({ title, color }: { title: string; color: string }) {
  return (
    <View className="flex-row items-center mb-3">
      <View className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-gray-400 text-xs tracking-widest ml-2 font-bold">{title}</Text>
    </View>
  );
}

function AxisDisplay({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center flex-1">
      <Text className="text-white/60 text-xs mb-1">{label}-Axis</Text>
      <Text className="text-white text-2xl font-mono font-bold">{value.toFixed(2)}</Text>
    </View>
  );
}

function SensorCard({ icon, name, available }: { icon: React.ReactNode; name: string; available: boolean }) {
  return (
    <View 
      className={`w-[48%]  p-4 border ${
        available 
          ? ' border-green-500/30' 
          : ' border-gray-700/30'
      }`}
    >
      <View 
        className={`w-12 h-12 rounded-xl items-center justify-center mb-3 ${
          available ? 'bg-green-500/30' : 'bg-gray-700/30'
        }`}
      >
        {icon}
      </View>
      <Text className="text-white font-semibold text-sm">{name}</Text>
      <Text className={`text-xs mt-1 font-bold ${available ? 'text-green-400' : 'text-gray-500'}`}>
        {available ? '● AVAILABLE' : '○ UNAVAILABLE'}
      </Text>
    </View>
  );
}
