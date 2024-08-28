import { Drawer } from "expo-router/drawer";
import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";

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
      <DrawerItem
        label={"Home"}
        labelStyle={[
          { marginLeft: -20, fontSize: 18 },
          { color: pathname === "/home" ? Colors.light.primary : "#7e7e7e" },
        ]}
        icon={({ color, size }) => (
          <Ionicons
            name="home"
            color={pathname === "/home" ? Colors.light.primary : "#7e7e7e"}
            size={24}
          />
        )}
        style={{ backgroundColor: pathname === "/home" ? "#C5C6D0" : "#fff" }}
        onPress={() => router.push("/home")}
      />
      <DrawerItem
        label={"My Account"}
        labelStyle={[
          { marginLeft: -20, fontSize: 18 },
          {
            color:
              pathname === "/my-account" ? Colors.light.primary : "#7e7e7e",
          },
        ]}
        icon={({ color, size }) => (
          <Ionicons
            name="person-outline"
            color={
              pathname === "/my-account" ? Colors.light.primary : "#7e7e7e"
            }
            size={24}
          />
        )}
        style={{
          backgroundColor: pathname === "/my-account" ? "#C5C6D0" : "#fff",
        }}
        onPress={() => router.push("/my-account")}
      />
      <DrawerItem
        label={"Notifications"}
        labelStyle={[
          { marginLeft: -20, fontSize: 18 },
          {
            color:
              pathname === "/notifications" ? Colors.light.primary : "#7e7e7e",
          },
        ]}
        icon={({ color, size }) => (
          <Ionicons
            name="notifications"
            color={
              pathname === "/notifications" ? Colors.light.primary : "#7e7e7e"
            }
            size={24}
          />
        )}
        style={{
          backgroundColor: pathname === "/notifications" ? "#C5C6D0" : "#fff",
        }}
        onPress={() => router.push("/notifications")}
      />
      <DrawerItem
        label={"Order History"}
        labelStyle={[
          { marginLeft: -20, fontSize: 18 },
          {
            color:
              pathname === "/order-history" ? Colors.light.primary : "#7e7e7e",
          },
        ]}
        icon={({ color, size }) => (
          <MaterialCommunityIcons
            name="history"
            color={
              pathname === "/order-history" ? Colors.light.primary : "#7e7e7e"
            }
            size={24}
          />
        )}
        style={{
          backgroundColor: pathname === "/order-history" ? "#C5C6D0" : "#fff",
        }}
        onPress={() => router.push("/order-history")}
      />
      <DrawerItem
        label={"Featured Products"}
        labelStyle={[
          { marginLeft: -20, fontSize: 18 },
          {
            color:
              pathname === "/featured-products"
                ? Colors.light.primary
                : "#7e7e7e",
          },
        ]}
        icon={({ color, size }) => (
          <AntDesign
            name="Safety"
            color={
              pathname === "/featured-products"
                ? Colors.light.primary
                : "#7e7e7e"
            }
            size={24}
          />
        )}
        style={{
          backgroundColor:
            pathname === "/featured-products" ? "#C5C6D0" : "#fff",
        }}
        onPress={() => router.push("/featured-products")}
      />
      <DrawerItem
        label={"Wishlist"}
        labelStyle={[
          { marginLeft: -20, fontSize: 18 },
          {
            color: pathname === "/wishlist" ? Colors.light.primary : "#7e7e7e",
          },
        ]}
        icon={({ color, size }) => (
          <Ionicons
            name="heart-outline"
            color={pathname === "/wishlist" ? Colors.light.primary : "#7e7e7e"}
            size={24}
          />
        )}
        style={{
          backgroundColor: pathname === "/wishlist" ? "#C5C6D0" : "#fff",
        }}
        onPress={() => router.push("/wishlist")}
      />
      <DrawerItem
        label={"Settings"}
        labelStyle={[
          { marginLeft: -20, fontSize: 18 },
          {
            color: pathname === "/settings" ? Colors.light.primary : "#7e7e7e",
          },
        ]}
        icon={({ color, size }) => (
          <Ionicons
            name="settings"
            color={pathname === "/settings" ? Colors.light.primary : "#7e7e7e"}
            size={24}
          />
        )}
        style={{
          backgroundColor: pathname === "/settings" ? "#C5C6D0" : "#fff",
        }}
        onPress={() => router.push("/settings")}
      />
    </DrawerContentScrollView>
  );
};

const DrawerLayout = () => {
  return (
    <Drawer
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
      <Drawer.Screen name="notifications" options={{ headerShown: true }} />
      <Drawer.Screen name="featured-products" options={{ headerShown: true }} />
      <Drawer.Screen name="my-account" options={{ headerShown: true }} />
      <Drawer.Screen name="order-history" options={{ headerShown: true }} />
      <Drawer.Screen name="settings" options={{ headerShown: true }} />
      <Drawer.Screen name="wishlist" options={{ headerShown: true }} />
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
});
