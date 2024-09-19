import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "@/constants/Colors";
import AddProductScreen from "@/components/AddProductScreen";
import AddServiceScreen from "@/components/AddServiceScreen";

const Tab = createMaterialTopTabNavigator();

const AddProductServiceScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.royalBlue,
        tabBarInactiveTintColor: Colors.light.rearText,
        tabBarIndicatorStyle: { backgroundColor: Colors.light.royalBlue },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ tabBarLabel: "Add Product" }}
      />
      <Tab.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{ tabBarLabel: "Add Service" }}
      />
    </Tab.Navigator>
  );
};

export default AddProductServiceScreen;
