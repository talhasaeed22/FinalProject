import React, { useEffect, useState, useContext } from 'react'
import { Text, View, Dimensions, Image, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import logo from './Images/Musiclogo.jpg'
import ModeContext from './Context/ModeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";


const Home = ({ navigation }) => {
    const [change, setChange] = useState(false);
    const [token, setToken] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const isFocused = useIsFocused();

    useEffect(()=>{
        if (isFocused || change) {
            setData();
          }
    }, [change, isFocused])

    const setData = async ()=>{
        const namme = await AsyncStorage.getItem('name')
        const tokeen = await AsyncStorage.getItem('token')
        const emmail = await AsyncStorage.getItem('email')

        setName(namme);
        setToken(tokeen);
        setEmail(emmail)

    }

    const context = useContext(ModeContext)
    const { mode } = context;

    const signout = async ()=>{
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('name')
        await AsyncStorage.removeItem('email')
        await AsyncStorage.removeItem('image')

        Alert.alert('Signed Out Successfully')
        setChange(true)
        navigation.navigate('Login')
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: mode === 'light' ? '#181c3f' : 'black' }}>

                <View style={{ backgroundColor: mode === 'light' ? 'white' : '#bdb2b1', borderBottomRightRadius: 80, flex: 1 }} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={logo} style={{ height: 120, width: 120, borderRadius: 24 }} />
                        <Text style={{ marginTop: 15, fontWeight: 'bold', fontStyle: 'italic', fontSize: 25, color: 'black' }}>Melophile </Text>
                        <Text style={{ fontSize: 16, fontStyle: 'italic' }}> An Intelligent Music Streaming App </Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: mode === 'light' ? 'white' : '#bdb2b1' }}>
                <View style={{ backgroundColor: mode === 'light' ? '#181c3f' : 'black', borderTopLeftRadius: 80, flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 35 }}>
                        <Text style={{ fontWeight: 'bold', marginTop: 12, fontSize: 28, color: 'white' }}>{token !== null ? `Hi, ${name}` : 'Please Login'}</Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 12, fontSize: 28, color: 'white', fontFamily:'Cabin-Bold' }}>Welcome to Melophile</Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 28, fontSize: 15, color: 'white', textAlign:'center' }}>We Suggest you to login to our app in order to have all the oppurtunities.</Text>
                        {token == null ? <Button labelStyle={{ fontWeight: 'bold' }} color={mode === 'light' ? 'white' : '#bdb2b1'} style={{ marginTop: 60, width: 125 }} icon="login" mode="contained" onPress={() => {  navigation.navigate('Login') }}>
                            Login
                        </Button> : <Button labelStyle={{ fontWeight: 'bold' }} color={mode === 'light' ? 'white' : '#bdb2b1'} style={{ marginTop: 60, width: 125 }} icon="login" mode="contained" onPress={signout}>
                            Logout
                        </Button>}
                    </View>
                </View>

            </View>
        </>

    )
}

export default Home