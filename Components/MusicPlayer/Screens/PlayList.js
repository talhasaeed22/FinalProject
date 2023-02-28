import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import colors from '../../misc/colors';
import PlaylistInputModal from '../Components/PlaylistInputModal';
import { AudioContext } from '../Context/AudioProvide';
const PlayList = () => {

  const context = useContext(AudioContext)
  const {playlist, addToPlaylist, updateState} = context

  const [modalVisible, setModalVisible] = useState(false);
  const onClose = ()=>{
    setModalVisible(false)
  }

  const createPlaylist = async (playlistName)=>{
    const result = await AsyncStorage.getItem('playlist');
    if(result !== null){
      const audios = [];
      if(addToPlaylist){
        audios.push(addToPlaylist);  
      }
      const newList = {
        id: Date.now(),
        title: playlistName,
        audios: audios
      }

      const updatedList = [...playlist , newList];
      updateState(context, {addToPlaylist:null, playlist: updatedList})
      await AsyncStorage.setItem('playlist', JSON.stringify(updatedList))
    }

    setModalVisible(false);
  }

  useEffect(()=>{
    if(!playlist.length){
      renderPlaylist();
    }
  }, [])

  const renderPlaylist = async ()=>{
    const result = await AsyncStorage.getItem('playlist')
    if(result === null){
      const defaultPlaylist = {
        id: Date.now(),
        title: 'My Favourite',
        audios: []
      }

      const newPlaylist = [...playlist, defaultPlaylist]
      updateState(context, {playlist: [...playlist]})
      return await AsyncStorage.setItem('playlist', JSON.stringify([...newPlaylist]))
    }
    updateState(context, {playlist: JSON.parse(result)})


  }
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.PlayListBanner}>
          <Text style={{fontSize:16}}>My Favourite</Text>
          <Text style={styles.audioCount}>0 Songs</Text>
        </TouchableOpacity>
        {/* <FlatList 
        data={playlist}
        keyExtractor={item => item.id.toString()}
        renderItem={({item})=> <Text>{item.title}</Text> }
        /> */}
        {playlist.length ? playlist.map(item => <TouchableOpacity key={item.id.toString()} style={styles.PlayListBanner}>
          <Text style={{fontSize:16}}>{item.title}</Text>
          <Text style={styles.audioCount}>{item.audios.length > 1 ? `${item.audios.length} songs` : `${item.audios.length} song` }</Text>
        </TouchableOpacity>) : null}
        <TouchableOpacity onPress={()=>{setModalVisible(true)}} style={{marginTop:15}}>
          <Text style={styles.PlayListButton}>+ Add new Playlist</Text>
        </TouchableOpacity>
        <PlaylistInputModal visible={modalVisible} onClose={onClose} onSubmit={createPlaylist}/>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container: {
      padding:20
    },
    PlayListBanner:{
      padding:10,
      backgroundColor: '#ebeffa',
      borderRadius:5,
      marginBottom:15
    },
    audioCount:{
      marginTop:3,
      opacity:0.5,
      fontSize:14,
    },
    PlayListButton:{
      color: colors.ACTIVE_BG,
      fontWeight:'bold',
      fontSize:14,
      padding:5
    }
  });

export default PlayList
