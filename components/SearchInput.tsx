import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface searchInputProps {
  placeholder: string;
  onChangeText: any;
  value: string;
}

const SearchInput = ({
  placeholder,
  onChangeText,
  value,
}: searchInputProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#999" style={styles.iconLeft} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
      />
      <MaterialIcons
        name="mic"
        size={20}
        color="#999"
        style={styles.iconRight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

export default SearchInput;
