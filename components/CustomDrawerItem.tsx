import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerItem } from "@react-navigation/drawer";
import { usePathname, router } from "expo-router";
import { Colors } from "@/constants/Colors";

interface DrawerIconProps {
  label: string;
  icon: React.ReactNode;
  pathName: string;
}

const CustomDrawerItem: React.FC<DrawerIconProps> = ({
  label,
  icon,
  pathName,
}) => {
  const pathname = usePathname();
  const isActive = pathname === `/${pathName}`;

  return (
    <View
      style={[styles.itemContainer, isActive && styles.activeItemContainer]}
    >
      <DrawerItem
        label={label}
        labelStyle={[styles.label, isActive && styles.activeLabel]}
        icon={({ size }) =>
          React.cloneElement(icon as React.ReactElement, {
            color: isActive ? Colors.light.primary : "#7e7e7e",
            size,
          })
        }
        onPress={() => router.push(`/${pathName}`)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeItemContainer: {
    borderBottomColor: Colors.light.primary,
  },
  label: {
    marginLeft: -20,
    fontSize: 18,
    color: "#7e7e7e",
  },
  activeLabel: {
    color: Colors.light.primary,
  },
});

export default CustomDrawerItem;
