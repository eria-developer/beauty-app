import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <View>
      <Stack>
        <Stack.Screen name='sign-in' />
        <Stack.Screen name='index' />
      </Stack>
    </View>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})