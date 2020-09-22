import 'react-native-gesture-handler';

import React, { useState } from 'react'

import FlashMessage from 'react-native-flash-message'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import SignIn from './src/components/signIn/signIn'
import Register from './src/components/register/register'
import QrScanner from './src/components/qrScanner/qrScanner'
import Switch from './src/components/switch/switch';
import Schedule from './src/components/schedule/schedule';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>

      <Stack.Navigator
        screenOptions = {{
          headerShown:false
        }}
      >

        <Stack.Screen 
          name="SignIn" 
          component={SignIn} 
          initialParams={{
            actualUser: '',
            places: ''
          }}
        />

        <Stack.Screen 
          name="Register"
          component={Register}
        />

        <Stack.Screen 
          name="QrScanner"
          component={QrScanner}
        />

        <Stack.Screen 
          name="Switch"
          component={Switch}
        />

        <Stack.Screen 
          name="Schedule"
          component={Schedule}
        />

      </Stack.Navigator>
      <FlashMessage position="top" />

    </NavigationContainer>
  )
}
