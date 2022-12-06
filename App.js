import React, { useState } from 'react';
import MyDrawer from './Components/MyDrawer'
import Home from './Components/Home'
import PlayerNavigation from './Components/MusicPlayer/PlayerNavigation'
import Settings from './Components/Settings'
import Social from './Components/SocialTabs/Social'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ModeState from './Components/Context/ModeState'
import AudioProvide from './Components/MusicPlayer/Context/AudioProvide';
import Login from './Components/Login';

const Drawer = createDrawerNavigator();

export default function App() {
  const [appmode, setAppmode] = useState('light')
  const switchDarkorLight = ()=>{
    if(appmode === 'light'){
      setAppmode('dark')
    }else{
      setAppmode('light')
    }
  }
  return (
      
    <ModeState>
      <NavigationContainer>
        <Drawer.Navigator screenOptions={{
        drawerStyle: {
          backgroundColor: appmode === 'light' ? 'white' : '#232624',
        },
      }}
        
         drawerContent={props => <MyDrawer switchDarkorLight={switchDarkorLight} {...props} />}>

          <Drawer.Screen name="Home" component={Home} options={{
            title: '',
            headerShown: true,
            headerTransparent: true,
          }} />

          <Drawer.Screen name="Social" component={Social} options={{
            title: 'Medium Share',
            headerShown: true,
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: appmode === 'light' ? '#181c3f' : 'black',
            },

          }} />
          <Drawer.Screen name="Player" component={PlayerNavigation} options={{
            title: '',
            headerShown: true,
            headerTintColor: 'white',
            headerTransparent: true,
          }} />
          <Drawer.Screen name="Setting" component={Settings} options={{
            title: '',
            headerShown: true,
            headerTransparent: true,
            headerTintColor: 'white',
          }} />
          <Drawer.Screen name="Login" component={Login} options={{
            title: '',
            headerShown: true,
            headerTransparent: true,
            headerTintColor: 'white',
          }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ModeState>
    
  );
}
