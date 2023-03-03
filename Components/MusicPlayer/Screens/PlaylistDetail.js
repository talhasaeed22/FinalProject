import { Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import colors from '../../misc/colors'
import AudioListItem from '../Components/AudioListItem'
import { play, selectAudio } from '../../misc/audioController'
import { AudioContext } from '../Context/AudioProvide'
import OptionModal from '../Components/OptionModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
const PlaylistDetail = (props) => {
    const playlist = props.route.params;
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    const [audios, setAudios] = useState(playlist.audios)
    const context = useContext(AudioContext)
    const playAudio = async (item) => {
        await selectAudio(context, item, { activePlaylist: playlist, isPlaylistRunning: true })
    }
    const RemoveAudio = async () => {

        let isPlaying = context.isPlaying, isPlaylistRunning = context.isPlaylistRunning, soundObject = context.soundObject, playbackPosition = context.playbackPosition, activePlaylist = context.activePlaylist

        if (context.isPlaylistRunning && context.currentAudio.id === selectedItem.id) {
            // Stop this audi
            await context.playbackObject.stopAsync();
            await context.playbackObject.unloadAsync();
            isPlaying = false, isPlaylistRunning = false, soundObject = null, playbackPosition = 0, activePlaylist = []

        }

        const newAudios = audios.filter(audio => audio.id !== selectedItem.id)
        const result = await AsyncStorage.getItem('playlist')
        if (result !== null) {
            const oldPlaylist = JSON.parse(result);
            const updatedPlaylist = oldPlaylist.filter((item) => {
                if (item.id === playlist.id) {
                    item.audios = newAudios
                }
                return item
            })

            await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist))
            context.updateState(context, { playlist: updatedPlaylist, isPlaylistRunning, activePlaylist, playbackPosition, isPlaying, soundObject })
        }
        setAudios(newAudios);
        setModalVisible(false);
    }
    const removePlaylist = async () => {
        let isPlaying = context.isPlaying, isPlaylistRunning = context.isPlaylistRunning, soundObject = context.soundObject, playbackPosition = context.playbackPosition, activePlaylist = context.activePlaylist

        if (context.isPlaylistRunning && activePlaylist.id === playlist.id) {
            // Stop this audi
            await context.playbackObject.stopAsync();
            await context.playbackObject.unloadAsync();
            isPlaying = false, isPlaylistRunning = false, soundObject = null, playbackPosition = 0, activePlaylist = []

        }

        const result = await AsyncStorage.getItem('playlist')
        if (result !== null) {
            const oldPlaylist = JSON.parse(result);
            const updatedPlaylist = oldPlaylist.filter(item => item.id !== playlist.id)

            await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist))
            context.updateState(context, { playlist: updatedPlaylist, isPlaylistRunning, activePlaylist, playbackPosition, isPlaying, soundObject })
        }
        
        props.navigation.goBack();
    }
    return (
        <>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, width: '100%' }}>
                    <Text style={{ fontSize: 25, textAlign: 'center', paddingVertical: 5, fontWeight: 'bold', color: colors.ACTIVE_BG }}>{playlist.title}</Text>
                    <TouchableOpacity onPress={removePlaylist}>
                        <FontAwesome style={{padding:15}} name='trash' size={23} color='red' />
                    </TouchableOpacity>
                </View>
                {audios.length ? <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={audios}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <View style={{ marginBottom: 10 }}>
                        <AudioListItem onOptionPress={() => { setSelectedItem(item); setModalVisible(true) }} isPlaying={context.isPlaying} activeListItem={item.id === context.currentAudio.id} title={item.filename} duration={item.duration} onAudioPress={() => { playAudio(item) }} />
                    </View>}
                /> : <View style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
                    <Icon name='music-off' size={35} color='black' />
                    <Text style={{ textAlign: "center", fontWeight: "bold", color: 'lightgray' }}>No Audio In Playlist</Text>
                </View>}
            </View>
            <OptionModal visible={modalVisible} onClose={() => { setModalVisible(false) }} options={[{ title: 'Remove From Playlist', onPress: RemoveAudio }]} currentItem={selectedItem} />

        </>

    )
}

export default PlaylistDetail

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },

    listContainer: {
        padding: 20
    }
})