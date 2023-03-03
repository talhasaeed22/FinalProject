import { Dimensions, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import colors from '../../misc/colors'
import AudioListItem from '../Components/AudioListItem'
import { selectAudio } from '../../misc/audioController'
import { AudioContext } from '../Context/AudioProvide'
const PlaylistDetail = (props) => {
    const context = useContext(AudioContext)
    const playlist = props.route.params;
    const playAudio = async (item) => {
        await selectAudio(context, item, {activePlaylist: playlist, isPlaylistRunning:true})
    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, textAlign: 'center', paddingVertical: 5, fontWeight: 'bold', color: colors.ACTIVE_BG }}>{playlist.title}</Text>
            <FlatList
                contentContainerStyle={styles.listContainer}
                data={playlist.audios}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <View style={{ marginBottom: 10 }}>
                    <AudioListItem isPlaying={context.isPlaying} activeListItem={item.id === context.currentAudio.id} title={item.filename} duration={item.duration} onAudioPress={() => { playAudio(item) }} />
                </View>}
            />
        </View>

    )
}

export default PlaylistDetail

const styles = StyleSheet.create({
    container: {
        alignSelf:'center'
    },
    
    listContainer: {
        padding: 20
    }
})