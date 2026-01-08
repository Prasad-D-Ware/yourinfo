import "@/global.css";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { HeroUINativeProvider } from "heroui-native";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";

function StackLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NativeTabs>
          <NativeTabs.Trigger name="index" >
              <Label>Overview</Label>
              <Icon sf={"house.fill"} selectedColor={"#22d3ee"}/>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="sensors">
              <Label>Sensors</Label>
              <Icon sf={"sensor"} selectedColor={"#22d3ee"}/>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="permissions">
              <Label>Permissions</Label>
              <Icon sf={"lock.shield"} selectedColor={"#22d3ee"}/>
          </NativeTabs.Trigger>
      </NativeTabs>
    </>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AppThemeProvider>
          <HeroUINativeProvider>
            <StackLayout />
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
