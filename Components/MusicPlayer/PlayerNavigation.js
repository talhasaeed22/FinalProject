import { Text, View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AudioList from './Screens/AudioList';
import PlayList from './Screens/PlayList';
import Player from './Screens/Player';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import AudioProvide from './Context/AudioProvide';
import { Title } from 'react-native-paper';
import PlaylistDetail from './Screens/PlaylistDetail';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const PlayListScreen = ()=>{
  return(
    <Stack.Navigator screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen name='PlayList' component={PlayList} />
      <Stack.Screen name='PlaylistDetail' component={PlaylistDetail} />
    </Stack.Navigator>
  )
}

export default function PlayerNavigation() {
  
  return (
    <>
      <AudioProvide>
        <Tab.Navigator>
          <Tab.Screen name='AudioList' component={AudioList} options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="headset" size={size} color={color} />,
            title:'TRACKS',
            headerTitleAlign: 'center',
            headerTintColor:'white',
            headerStyle: {
              backgroundColor: '#181c3f'
            },
          }} />
          <Tab.Screen name='MusicPlayer' component={Player} options={{
            tabBarIcon: ({ color, size }) => <FontAwesome name="compact-disc" size={size} color={color} />,
            title:'PLAYER',
            headerTitleAlign: 'center',
            headerTintColor:'white',
            headerStyle: {
              backgroundColor: '#181c3f'
            },
          }} />
          <Tab.Screen name='Playlist' component={PlayListScreen} options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="my-library-music" size={size} color={color} />,
            title:'PLAYLIST',
            headerTitleAlign: 'center',
            headerTintColor:'white',
            headerStyle: {
              backgroundColor: '#181c3f'
            },
          }} />
        </Tab.Navigator>
      </AudioProvide>
    </>
  )
}
