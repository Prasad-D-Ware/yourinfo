import { ActivityIndicator, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";

import * as Device from "expo-device";
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Container } from "@/components/container";
import { useEffect, useState } from "react";
import GlobeView from "@/components/globalView";
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

interface DeviceInfo {
  model: string | null;
  os: string;
  brand: string | null;
  isDevice: boolean;
}

interface LocationData {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  error?: string;
}

interface AppData {
  fingerprint: string;
  location: LocationData;
  device: DeviceInfo;
  battery: number;
  network: string | undefined;
  ip: string;
  locationPermission: string;
  sensorsAvailable: string;
}

export default function Home() {
  const [data, setData] = useState<Partial<AppData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const deviceInfo = {
        model: Device.modelName,
        os: Device.osName + ' ' + Device.osVersion,
        brand: Device.brand,
        isDevice: Device.isDevice,
      };
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const networkState = await Network.getNetworkStateAsync();
      const ipAddress = await Network.getIpAddressAsync();
      const { status: locationPerm } = await Location.getForegroundPermissionsAsync();
      const accelData = await Sensors.Accelerometer.isAvailableAsync();

      const location = await getLocationData();

      setData({
        fingerprint: await generateFingerprint(),
        location: location,
        device: deviceInfo,
        battery: Math.round(batteryLevel * 100),
        network: networkState.type,
        ip: ipAddress,
        locationPermission: locationPerm,
        sensorsAvailable: accelData ? 'Yes' : 'No',
      });
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <PulsingLoader />
      </View>
    );
  }

  return (
    <Container className="bg-black">
      <Animated.View entering={FadeInDown.duration(600)} className="px-4 pt-6 pb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-gray-400 text-sm tracking-widest uppercase">Welcome to</Text>
            <Text className="text-white text-4xl font-black tracking-tight">
              YOUR<Text className="text-cyan-400">INFO</Text>
            </Text>
          </View>
          <View className="bg-red-500/20 px-3 py-1 rounded-full border border-red-500/50">
            <Text className="text-red-400 text-xs font-bold">● LIVE</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-sm">
          We know more about you than you think...
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(600)} className="px-4">
        <GlobeView latitude={data.location?.latitude} longitude={data.location?.longitude} />
        {data.location?.latitude && (
          <View className="absolute bottom-6 left-6 right-6">
            <BlurView intensity={80} tint="dark" className="rounded-xl overflow-hidden">
              <View className="px-4 py-3 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="location" size={18} color="#22d3ee" />
                  <Text className="text-cyan-400 ml-2 font-mono text-sm">
                    {data.location.latitude?.toFixed(4)}°, {data.location.longitude?.toFixed(4)}°
                  </Text>
                </View>
                <Text className="text-gray-400 text-xs">{data.location.timezone}</Text>
              </View>
            </BlurView>
          </View>
        )}
      </Animated.View>

      <View className="px-4 mt-6">
        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <SectionTitle icon="fingerprint" title="UNIQUE IDENTIFIERS" color="#a855f7" />
          <InfoCard
            gradient={['#7c3aed', '#a855f7']}
            icon={<MaterialCommunityIcons name="fingerprint" size={28} color="#fff" />}
            items={[
              { label: 'Device Fingerprint', value: data.fingerprint || 'Generating...' },
            ]}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <SectionTitle icon="phone-portrait" title="DEVICE INFO" color="#06b6d4" />
          <View className="flex-row gap-3">
            <MiniCard
              icon={<Ionicons name="phone-portrait" size={24} color="#06b6d4" />}
              label="Model"
              value={data.device?.model || 'Unknown'}
              color="#06b6d4"
            />
            <MiniCard
              icon={<FontAwesome5 name="apple" size={22} color="#06b6d4" />}
              label="Brand"
              value={data.device?.brand || 'Unknown'}
              color="#06b6d4"
            />
          </View>
          <View className="flex-row gap-3 mt-3">
            <MiniCard
              icon={<MaterialCommunityIcons name="cellphone-cog" size={24} color="#06b6d4" />}
              label="OS"
              value={data.device?.os || 'Unknown'}
              color="#06b6d4"
            />
            <MiniCard
              icon={<Ionicons name={data.device?.isDevice ? "checkmark-circle" : "close-circle"} size={24} color={data.device?.isDevice ? "#22c55e" : "#ef4444"} />}
              label="Physical"
              value={data.device?.isDevice ? 'Yes' : 'No'}
              color={data.device?.isDevice ? "#22c55e" : "#ef4444"}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(500)}>
          <SectionTitle icon="wifi" title="NETWORK" color="#f59e0b" />
          <InfoCard
            gradient={['#d97706', '#f59e0b']}
            icon={<Ionicons name="globe" size={28} color="#fff" />}
            items={[
              { label: 'Connection Type', value: data.network?.toUpperCase() || 'Unknown', highlight: true },
              { label: 'IP Address', value: data.ip || 'Unavailable' },
            ]}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(500)}>
          <SectionTitle icon="battery-charging" title="POWER STATUS" color="#22c55e" />
          <BatteryCard level={data.battery || 0} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).duration(500)}>
          <SectionTitle icon="shield-checkmark" title="PERMISSIONS & SENSORS" color="#ec4899" />
          <View className="flex-row gap-3">
            <PermissionCard
              icon={<Ionicons name="location" size={22} color="#fff" />}
              label="Location"
              status={data.locationPermission || 'unknown'}
            />
            <PermissionCard
              icon={<MaterialCommunityIcons name="motion-sensor" size={22} color="#fff" />}
              label="Sensors"
              status={data.sensorsAvailable === 'Yes' ? 'granted' : 'denied'}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(800).duration(500)} className="mt-8 mb-6">
          <View className="bg-red-500/10 border border-red-500/30  p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="warning" size={20} color="#ef4444" />
              <Text className="text-red-400 font-bold ml-2">Privacy Warning</Text>
            </View>
            <Text className="text-gray-400 text-sm leading-5">
              This is just a fraction of what apps can collect. Your digital footprint 
              is larger than you think. Consider using VPNs and privacy-focused tools.
            </Text>
          </View>
        </Animated.View>
      </View>
    </Container>
  );
}

function PulsingLoader() {
  const scale = useSharedValue(1);
  
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View className="w-20 h-20 rounded-full bg-cyan-500/20 items-center justify-center">
        <View className="w-12 h-12 rounded-full bg-cyan-500/40 items-center justify-center">
          <MaterialCommunityIcons name="fingerprint" size={30} color="#22d3ee" />
        </View>
      </View>
    </Animated.View>
  );
}

function SectionTitle({ icon, title, color }: { icon: string; title: string; color: string }) {
  return (
    <View className="flex-row items-center mt-6 mb-3">
      <Ionicons name={icon as any} size={16} color={color} />
      <Text className="text-gray-400 text-xs tracking-widest ml-2 font-bold">{title}</Text>
    </View>
  );
}

function InfoCard({ 
  gradient, 
  icon, 
  items 
}: { 
  gradient: [string, string]; 
  icon: React.ReactNode; 
  items: { label: string; value: string; highlight?: boolean }[] 
}) {
  return (
    <View className="rounded-xl overflow-hidden">
      <LinearGradient
        colors={[...gradient, gradient[1] + '80']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4"
      >
        <View className="flex-row items-start">
          <View className="bg-white/20 rounded-xl p-3 mr-4 flex items-center justify-center">
              {icon}
          </View>
          <View className="flex-1 p-3">
            {items.map((item, index) => (
              <View key={index} className={index > 0 ? "mt-2" : ""}>
                <Text className="text-white/60 text-xs uppercase tracking-wider">{item.label}</Text>
                <Text 
                  className={`text-white font-mono ${item.highlight ? 'text-lg font-bold' : 'text-sm'}`}
                  numberOfLines={1}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function MiniCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color: string 
}) {
  return (
    <View 
      className="flex-1  border  p-4"
      style={{ borderColor: color + '60' }}
    >
      <View className="flex-row items-center mb-2">
        {icon}
        <Text className="text-gray-400 text-xs ml-2 uppercase tracking-wider">{label}</Text>
      </View>
      <Text className="text-white font-semibold" numberOfLines={1}>{value}</Text>
    </View>
  );
}


function BatteryCard({ level }: { level: number }) {
  const getColor = () => {
    if (level > 60) return '#22c55e';
    if (level > 30) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View className="border border-green-500/30  p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons 
            name={level > 80 ? "battery-full" : level > 40 ? "battery-half" : "battery-dead"} 
            size={32} 
            color={getColor()} 
          />
          <View className="ml-3">
            <Text className="text-gray-400 text-xs uppercase tracking-wider">Battery Level</Text>
            <Text className="text-white text-2xl font-black">{level}%</Text>
          </View>
        </View>
        <View className="items-end">
          <View 
            className="w-32 h-4 bg-gray-800 rounded-full overflow-hidden"
          >
            <View 
              className="h-full rounded-full"
              style={{ 
                width: `${level}%`, 
                backgroundColor: getColor(),
              }} 
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function PermissionCard({ 
  icon, 
  label, 
  status 
}: { 
  icon: React.ReactNode; 
  label: string; 
  status: string 
}) {
  const isGranted = status === 'granted';
  
  return (
    <View 
      className={`flex-1  p-4 border ${
        isGranted 
          ? ' border-green-500/30' 
          : 'bg-red-500/10 border-red-500/30'
      }`}
    >
      <View 
        className={`w-10 h-10 rounded-xl items-center justify-center mb-2 ${
          isGranted ? 'bg-green-500/30' : 'bg-red-500/30'
        }`}
      >
        {icon}
      </View>
      <Text className="text-gray-400 text-xs uppercase tracking-wider">{label}</Text>
      <Text 
        className={`font-bold mt-1 ${isGranted ? 'text-green-400' : 'text-red-400'}`}
      >
        {isGranted ? 'GRANTED' : 'DENIED'}
      </Text>
    </View>
  );
}



async function generateFingerprint(): Promise<string> {
	const uniqueId = Device.osBuildId ?? `${Device.osInternalBuildId ?? ''}-${Device.modelId ?? ''}`;
	const model = Device.modelName ?? '';
	const os = Device.osName ?? '';
	const hashInput = `${uniqueId}-${model}-${os}`; // Combine unique traits
	const fingerprint = await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		hashInput
	);
	await AsyncStorage.setItem('fingerprint', fingerprint); 
	return fingerprint.slice(0, 10);
}

const getLocationData = async (): Promise<LocationData> => {
  const { status: perm } = await Location.requestForegroundPermissionsAsync();
  if (perm !== 'granted') return { error: 'Location permission denied' };
  const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};
