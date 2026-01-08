import { cn } from "heroui-native";
import { type PropsWithChildren } from "react";
import { ScrollView, View, type ViewProps, StatusBar } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = AnimatedProps<ViewProps> & {
  className?: string;
};

export function Container({ children, className, ...props }: PropsWithChildren<Props>) {
  const insets = useSafeAreaInsets();

  return (
    <AnimatedView
      className={cn("flex-1 bg-black", className)}
      style={{
        paddingBottom: insets.bottom,
        paddingTop: insets.top
      }}
      {...props}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </AnimatedView>
  );
}
