import { Tabs } from "expo-router";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerToggleButton } from "@react-navigation/drawer";
// import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        headerShown: true,
        headerLeft: () => <DrawerToggleButton tintColor="#fff" />,
        headerStyle: {
          backgroundColor: Colors.light.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="food-fork-drink"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name="medal" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(more)"
        options={{
          headerShown: false,
          title: "More",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="more-horizontal" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
