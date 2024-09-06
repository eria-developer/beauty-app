import { Drawer } from "expo-router/drawer";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";
import CustomDrawerItem from "@/components/CustomDrawerItem";

const CustomDrawerContent = (props: any) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
      <View>
        <View>
          <Image
            style={styles.image}
            source={{
              uri: "https://img.freepik.com/free-photo/handsome-adult-male-posing_23-2148729713.jpg?t=st=1724867314~exp=1724870914~hmac=73d4741048a55ff929b604ac72996e6640ac1634bbcdaadf800d6f67a414f939&w=740",
            }}
          />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>Talemwa Eria Jackson</Text>
        </View>
        <View style={styles.emailContainer}>
          <Text style={styles.email}>eriddeveloper@gmail.com</Text>
        </View>
      </View>

      <CustomDrawerItem
        label="Home"
        icon={<Ionicons name="home-outline" size={16} />}
        pathName="home"
      />
      <CustomDrawerItem
        label="My Account"
        icon={<Ionicons name="person-outline" size={16} />}
        pathName="(my-account)"
      />
      <CustomDrawerItem
        label="Notifications"
        icon={<Ionicons name="notifications-outline" size={16} />}
        pathName="notifications"
      />
      <CustomDrawerItem
        label="Order History"
        icon={<MaterialCommunityIcons name="history" size={16} />}
        pathName="order-history"
      />
      <CustomDrawerItem
        label="Featured Products"
        icon={<AntDesign name="Safety" size={16} />}
        pathName="featured-products"
      />
      <CustomDrawerItem
        label="Wishlist"
        icon={<Ionicons name="heart-outline" size={16} />}
        pathName="wishlist"
      />
      <CustomDrawerItem
        label="Settings"
        icon={<Ionicons name="settings-outline" size={16} />}
        pathName="settings"
      />
    </DrawerContentScrollView>
  );
};

const DrawerLayout = () => {
  return (
    <Drawer
      initialRouteName="(order)"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
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
      <Drawer.Screen
        name="notifications"
        options={{
          headerShown: true,
          title: "NOTIFICATIONS",
          headerRight: () => (
            <View>
              <TouchableOpacity style={styles.clearAllContainer}>
                <Text style={styles.clearAllText}>CLEAR ALL</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Drawer.Screen name="featured-products" options={{ headerShown: true }} />
      <Drawer.Screen name="(my-account)" options={{ headerShown: false }} />
      <Drawer.Screen
        name="order-history"
        options={{ headerShown: true, title: "ORDER HISTORY" }}
      />
      <Drawer.Screen name="settings" options={{ headerShown: true }} />
      <Drawer.Screen
        name="wishlist"
        options={{ headerShown: true, title: "WISHLIST" }}
      />
    </Drawer>
  );
};

export default DrawerLayout;

const styles = StyleSheet.create({
  image: {
    borderRadius: 100,
    height: 100,
    width: 100,
    alignSelf: "center",
    marginTop: 20,
  },
  name: {
    fontSize: 18,
    textAlign: "center",
  },
  nameContainer: { marginVertical: 10 },
  email: {
    fontSize: 15,
    textAlign: "center",
  },
  emailContainer: { marginBottom: 20, marginTop: 5 },
  clearAllContainer: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  clearAllText: {
    color: "darkblue",
    fontSize: 10,
    fontWeight: "bold",
  },
});
