// components/screen-header.tsx
import { View ,Text } from "react-native";
import { ThemeToggle } from "@/components/theme-toggle";

export function ScreenHeader({ title }: { title: string }) {
  return (
    <View className="flex-row justify-between items-center px-4 pt-2 pb-2">
      <Text className="text-xl font-bold text-foreground">{title}</Text>
      <ThemeToggle/>
    </View>
  );
}