import { View, Text, Modal, TextInput, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import Ant from 'react-native-vector-icons/AntDesign'
import colors from '../../misc/colors'
const PlaylistInputModal = ({visible,onClose,onSubmit }) => {
    const [playlistName, setplaylistName] = useState('')
    const handleOnSubmit = ()=>{
        if(!playlistName.trim()){
            onClose();
        }else{
            onSubmit(playlistName);
            setplaylistName('')
            onClose();
        }
    }   
  return (
    <Modal
    visible={visible}
    animationType='fade'
    transparent
    >
        <View style={styles.modalContainer}>
            <View style={styles.inputContainer}>
                <Text style={{color:colors.ACTIVE_BG, fontSize:16, textAlign:"left"}}>Create New Playlist</Text>
                <TextInput placeholder='Title' value={playlistName} onChangeText={setplaylistName} style={styles.input} />
                <Ant onPress={handleOnSubmit} style={styles.submit} name='check' size={24} color='#fff' />
            </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}></View>
        </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
    modalContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',

    },
    inputContainer:{
        width: Dimensions.get('window').width - 20,
        height: 200,
        borderRadius:10,
        backgroundColor:'#fff',
        justifyContent:"center",
        alignItems:'center'
    },
    input:{
        width: Dimensions.get('window').width - 40,
        borderBottomWidth:1,
        borderBottomColor: '#181c3f',
        paddingVertical:5,
        fontSize:18
    },
    submit:{
        padding:10,
        backgroundColor:'#181c3f',
        borderRadius:50,
        marginTop:15
    } ,
    modalBG:{
        backgroundColor:colors.MODAL_BG,
        zIndex:-1
    }

})

export default PlaylistInputModal