import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, FlatList, Alert } from 'react-native';
import colors from '../../misc/colors';
import PlaylistDetail from '../Components/PlaylistDetail';
import PlaylistInputModal from '../Components/PlaylistInputModal';
import { AudioContext } from '../Context/AudioProvide';
let SelectedPLaylist = {}
const PlayList = ({navigation}) => {

  const context = useContext(AudioContext)
  const { playlist, addToPlaylist, updateState } = context
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const onClose = () => {
    setModalVisible(false)
  }

  const createPlaylist = async (playlistName) => {
    const result = await AsyncStorage.getItem('playlist');
    if (result !== null) {
      const audios = [];
      if (addToPlaylist) {
        audios.push(addToPlaylist);
      }
      const newList = {
        id: Date.now(),
        title: playlistName,
        audios: audios
      }

      const updatedList = [...playlist, newList];
      updateState(context, { addToPlaylist: null, playlist: updatedList })
      await AsyncStorage.setItem('playlist', JSON.stringify(updatedList))
    }

    setModalVisible(false);
  }

  useEffect(() => {
    if (!playlist.length) {
      renderPlaylist();
    }
  }, [])

  const renderPlaylist = async () => {
    const result = await AsyncStorage.getItem('playlist')
    if (result === null) {
      const defaultPlaylist = {
        id: Date.now(),
        title: 'My Favourite',
        audios: []
      }

      const newPlaylist = [...playlist, defaultPlaylist]
      updateState(context, { playlist: [...playlist] })
      return await AsyncStorage.setItem('Playlist', JSON.stringify([...newPlaylist]))
    }
    updateState(context, { playlist: JSON.parse(result) })


  }
  const handlebannerPress = async (playlist) => {
    //Update Playlist if there is any selected audio
    if (addToPlaylist) {
      const result = await AsyncStorage.getItem('playlist');
      let oldList = []
      let updatedList = []
      let sameAudio = false

      if (result !== null) {
        oldList = JSON.parse(result);

        updatedList = oldList.filter(list => {
          if (list.id === playlist.id) {
            //Check if that same audio is already inside list or not
            for (let audio of list.audios) {
              if (audio.id === addToPlaylist.id) {
                //Alert with some message
                sameAudio = true;
                return;
              }
            }
            // otherwise update the playlist
            list.audios = [...list.audios, addToPlaylist];

          }
          return list;
        })
      }

      if (sameAudio) {
        Alert.alert('Already Present!', `${addToPlaylist.filename} is already inside the list`);
        sameAudio = false;
        return updateState(context, { addToPlaylist: null })
      }

      updateState(context, { addToPlaylist: null, playlist: [...updatedList] });
      return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]))

    }
    
    //If there is no audio selected then we want to open the list
    SelectedPLaylist = playlist;
    // setShowPlaylist(true);
    navigation.navigate('PlaylistDetail', playlist)

  }
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {playlist.length ? playlist.map(item => <TouchableOpacity onPress={() => handlebannerPress(item)} key={item.id.toString()} style={styles.PlayListBanner}>
          <Text style={{ fontSize: 16 }}>{item.title}</Text>
          <Text style={styles.audioCount}>{item.audios.length > 1 ? `${item.audios.length} songs` : `${item.audios.length} song`}</Text>
        </TouchableOpacity>) : null}
        <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ marginTop: 15 }}>
          <Text style={styles.PlayListButton}>+ Add new Playlist</Text>
        </TouchableOpacity>
        <PlaylistInputModal visible={modalVisible} onClose={onClose} onSubmit={createPlaylist} />
      </ScrollView>
      {/* <PlaylistDetail visible={showPlaylist} playlist={SelectedPLaylist} onClose={()=>{setShowPlaylist(false)}} /> */}
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  PlayListBanner: {
    padding: 10,
    backgroundColor: '#ebeffa',
    borderRadius: 5,
    marginBottom: 15
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.5,
    fontSize: 14,
  },
  PlayListButton: {
    color: colors.ACTIVE_BG,
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5
  }
});

export default PlayList
