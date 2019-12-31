import React from "react";
import { View, Text } from "react-native";
import { styles } from "../App.style";

export default function NoPermission() {
  return (
    <View style={styles.container}>
      <View />
      <Text style={styles.noPermissionsText}>
        You must enable audio recording permissions in order to use this app.
      </Text>
      <View />
    </View>
  );
}
