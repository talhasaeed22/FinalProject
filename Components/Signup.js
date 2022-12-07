import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Button, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Anticon from 'react-native-vector-icons/AntDesign'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { IconButton, TextInput } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('')
    const [name, setName] = useState('')
    const [showpass, setShowPass] = useState(false);
    const [imageShow, setImageShow] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const openCamera = async () => {
        await ImageCropPicker.openPicker({
            width: 1200,
            height: 1080,
            cropping: true
        }).then(immage => {
            const imaeUri = Platform.OS === 'ios' ? immage.sourceURL : immage.path;
            setImageShow(imaeUri);
            console.log(imaeUri)

        });
    }

    const uploadImage = async () => {
        console.log('INsde Uplaod IMage')

        let filename = imageShow.substring(imageShow.lastIndexOf('/') + 1)

        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.')

        filename = name + Date.now() + '.' + extension

        const StorageRef = storage().ref(`profilepic/${filename}`)

        const task = StorageRef.putFile(imageShow)

        try {
            await task

            const url = await StorageRef.getDownloadURL()
            setImageShow('')

            return url

        } catch (error) {
            console.log(error)

            setImageShow('')
            return null
        }

    }


    const handleSignup = async () => {
        if (email === '' || name === '' || pass === '' || imageShow === '') {
            if (imageShow === '') {
                Alert.alert('Please Select Profile Image')
            }else if(pass.length < 6){
                Alert.alert('Password Should be greater than 6')
            } 
            else {
                Alert.alert('Please Fill all the fields')

            }
        } else {
            setIsLoading(true);
            const uri = await uploadImage();
            const response = await fetch(`http://192.168.100.122:5000/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, email: email, password: pass, image: uri })
            });


            const json = await response.json();
            console.log(json.name);
            if (json.success) {
                //SAVE THE AUTH TOKEN AND REDIRECT
                await AsyncStorage.setItem('token', json.token);
                await AsyncStorage.setItem('name', json.name);
                await AsyncStorage.setItem('email', json.email);
                await AsyncStorage.setItem('image', json.image);
                setIsLoading(false)
                Alert.alert('Account Created Successfully')
                navigation.navigate('Home')
            } else {
                Alert.alert("Invalid Credintials");
                setIsLoading(false)
            }
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
                    <View style={{ marginTop: 13, }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}> Signup Form </Text>
                    </View>
                </View>
            </View>

            <View style={{ paddingLeft: 40, paddingRight: 40 }}>

                <View>


                    <TextInput onChangeText={setName} left={<TextInput.Icon name="account" color='#181c3f' size={22} />} underlineColor='#181c3f' theme={{ colors: { placeholder: '#636bad', text: '#181c3f', primary: '#636bad', background: 'transparent' } }} style={{ marginTop: 7, marginBottom: 7, color: 'red', height: 60 }} label='Name' mode='flat' />


                    <TextInput onChangeText={setEmail} left={<TextInput.Icon name="email" color='#181c3f' size={22} />} underlineColor='#181c3f' theme={{ colors: { placeholder: '#636bad', text: '#181c3f', primary: '#636bad', background: 'transparent' } }} style={{ marginTop: 7, marginBottom: 7, color: 'red', height: 60 }} label='Email' mode='flat' />


                    <TextInput onChangeText={setPass} secureTextEntry={showpass === true ? false : true} left={<TextInput.Icon name="lock" color='#181c3f' size={22} />} right={<TextInput.Icon onPress={() => { setShowPass(!showpass) }} name="eye" color='#181c3f' size={22} style={{ paddingTop: 5 }} />} underlineColor='#181c3f' theme={{ colors: { placeholder: '#636bad', text: '#181c3f', primary: '#636bad', background: 'transparent' } }} style={{ marginTop: 7, color: 'red', height: 60 }} label='Password' mode='flat' />

                </View>

                <View style={{ justifyContent: "center", display: 'flex', flexDirection: 'row' }}>
                    {isLoading ? <ActivityIndicator /> : <IconButton
                        icon={() => (<Anticon onPress={handleSignup} name={'login'} size={50} color={'#181c3f'} />)}
                        size={50}
                    />}
                    <View style={{ marginLeft: 45 }}>
                        {imageShow === '' ? <IconButton
                            icon={() => (<MaterialIcon onPress={openCamera} name={'add-a-photo'} size={20} color={'#181c3f'} />)}
                            size={50}
                        /> : <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton
                                icon={() => (<MaterialIcon onPress={openCamera} name={'check-circle'} size={20} color={'#181c3f'} />)}
                                size={50}
                            />
                            <Text>Image Selected</Text>
                        </View>}
                    </View>
                    {/* <Button title='Signup' onPress={handleSignup} /> */}
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#181c3f', textAlign: 'center', fontSize: 15 }} > Already have an Account? <Text onPress={() => { navigation.navigate('Signin') }} style={{ fontStyle: 'italic', fontWeight: 'bold', color: '#636bad', textDecorationLine: 'underline' }}> Login Here </Text> </Text>
                </View>

            </View>

        </ScrollView>
    );
}
