// import { Dimensions, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import colors from '../../misc/colors'
// import AudioListItem from './AudioListItem'
// import { selectAudio } from '../../misc/audioController'
// const PlaylistDetail = ({visible, playlist, onClose}) => {
//     const playAudio = async (item)=>{
//         selectAudio(  ,item)
//     }
//   return (
//     <Modal
//     visible={visible}
//     animationType="slide"
//     transparent
//     onRequestClose={onClose}
//     >
//         <View style={styles.container}>
//             <Text style={{fontSize:20, textAlign:'center', paddingVertical:5, fontWeight:'bold', color:colors.ACTIVE_BG }}>{playlist.title}</Text>
//             <FlatList 
//             contentContainerStyle={styles.listContainer}
//             data={playlist.audios}
//             keyExtractor={item => item.id.toString()}
//             renderItem={({item})=> <View style={{marginBottom:10}}>
//                 <AudioListItem title={item.filename} duration={item.duration} onAudioPress={()=>{playAudio(item)}} />
//             </View> }
//             />

//         </View>
//         <View style={[StyleSheet.absoluteFill, styles.modalBG]}></View>
//     </Modal>
//   )
// }

// export default PlaylistDetail

// const styles = StyleSheet.create({
//     container:{
//         position:'absolute',
//         bottom:0,
//         alignSelf:'center',
//         height :Dimensions.get('window').height - 150,
//         width: Dimensions.get('window').width - 15,
//         backgroundColor:'white',
//         borderTopRightRadius:30,
//         borderTopLeftRadius:30,
//     },
//     modalBG:{
//         backgroundColor:colors.MODAL_BG,
//         zIndex:-1
//     },
//     listContainer:{
//         padding:20
//     }
// })