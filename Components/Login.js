import React, { useState } from 'react';
import { Text, View, Dimensions, Image, ScrollView, Alert, Modal, Pressable } from 'react-native';
import Anticon from 'react-native-vector-icons/AntDesign'
import { IconButton, TextInput } from 'react-native-paper'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from './Signup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SigninScreen = ({ navigation }) => {
    const [showpass, setShowPass] = useState(false);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('')


    const handleSignin = async () => {
        const response = await fetch(`http://192.168.100.122:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:email, password:pass})
        });
        const json = await response.json();
        console.log(json.name);
        if(json.success){
            //SAVE THE AUTH TOKEN AND REDIRECT
            await AsyncStorage.setItem('token', json.token);
            await AsyncStorage.setItem('name', json.name);
            await AsyncStorage.setItem('email', json.email);
            Alert.alert('Login Successfully')
            navigation.navigate('Home')
        }else{
            Alert.alert("Invalid Credintials");
        }
    }


    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <View style={{ backgroundColor: 'white' }}>

                <View style={{ backgroundColor: '#181c3f', alignItems: 'center', borderBottomLeftRadius: 300, height: 320, width: Dimensions.get('window').width }} >
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                        <Image style={{ width: 100, height: 100 }} source={require('./Images/whitelogo.png')} />
                        <Text style={{ fontSize: 31, color: 'white', fontWeight: 'bold', }}>ELOPHILE </Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontStyle: 'italic', color: 'white' }}> An Intelligent Music Player App </Text>
                    </View>
                </View>
            </View>

            <View style={{ padding: 20, paddingLeft: 40, paddingRight: 40 }}>

                <View>
                    <TextInput value={email} onChangeText={setEmail} left={<TextInput.Icon name="email" color='#181c3f' size={22} />} underlineColor='#181c3f' theme={{ colors: { placeholder: '#636bad', text: '#181c3f', primary: '#636bad', background: 'transparent' } }} style={{ marginTop: 7, marginBottom: 7, color: 'red', height: 60 }} label='Email' mode='flat' />

                    <TextInput value={pass} onChangeText={setPass} secureTextEntry={showpass === true ? false : true} left={<TextInput.Icon name="lock" color='#181c3f' size={22} />} right={<TextInput.Icon onPress={() => { setShowPass(!showpass) }} name="eye" color='#181c3f' size={22} style={{ paddingTop: 5 }} />} underlineColor='#181c3f' theme={{ colors: { placeholder: '#636bad', text: '#181c3f', primary: '#636bad', background: 'transparent' } }} style={{ marginTop: 7, color: 'red', height: 60 }} label='Password' mode='flat' />

                </View>


                <View style={{ alignItems: 'center' }}>
                    <IconButton
                        icon={() => (<Anticon name={'login'} size={50} color={'#181c3f'} />)}
                        size={50}
                        onPress={handleSignin}
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#181c3f', textAlign: 'center', fontSize: 15 }} > Dont't have an Account? <Text onPress={() => { navigation.navigate('Signup') }} style={{ fontStyle: 'italic', fontWeight: 'bold', color: '#636bad', textDecorationLine: 'underline' }}> Register Here </Text> </Text>
                </View>

            </View>


        </ScrollView>
    )
}

const Stack = createNativeStackNavigator();

export default function Login() {

    return (
        <Stack.Navigator initialRouteName="Signin">
            <Stack.Screen options={{
                title: '', headerStyle: {
                    backgroundColor: '#181c3f',
                },
            }} name="Signin" component={SigninScreen} />

            <Stack.Screen options={{
                title: '', headerStyle: {
                    backgroundColor: '#181c3f',
                },
            }} name="Signup" component={Signup} />


        </Stack.Navigator>
    );
}

