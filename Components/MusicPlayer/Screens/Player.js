import React, { Component, useContext, useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import colors from '../../misc/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../Components/PlayerButton';
import { AudioContext } from '../Context/AudioProvide'
import { changeAudio, MoveAudio, pause, play, playNext, resume, selectAudio } from '../../misc/audioController';
import { convertTime, storeAudioForNextOpening } from '../../misc/helper';
import AntDesign from 'react-native-vector-icons/AntDesign'

const Player = () => {
  const { width } = Dimensions.get('window');
  const [currentPosition, setCurrentPosition] = useState(0)
  const context = useContext(AudioContext)
  const {
    audioCount,
    currentAudioIndex,
    playbackDuration,
    playbackPosition,
    currentAudio
  } = context;
  const [seekbar, setSeekbar] = useState(null);

  const calculateSeekbar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if(currentAudio.lastPositon){
      return currentAudio.lastPositon / (currentAudio.duration * 1000)
    }

    return 0;
  };

  useEffect(() => {
    context.loadPreviousAudio()

  }, [])

  const handlePlayPause = async () => {
    await selectAudio(context, context.currentAudio)
    // //play
    // if (context.soundObject === null) {
    //   const audio = context.currentAudio;
    //   const status = await play(context.playbackObject, audio.uri);
    //   context.playbackObject.setOnPlaybackStatusUpdate(context.onPlaybackStatusUpdate)
    //   return context.updateState(context, {
    //     soundObject: status,
    //     currentAudio: audio,
    //     isPlaying: true,
    //     currentAudioIndex: context.currentAudioIndex
    //   })
    // }
    // //pause
    // if (context.soundObject && context.soundObject.isPlaying) {
    //   const status = await pause(context.playbackObject)
    //   return context.updateState(context, {
    //     soundObject: status,
    //     isPlaying: false,

    //   })
    // }
    // //resume
    // if (context.soundObject && !context.soundObject.isPlaying) {
    //   const status = await resume(context.playbackObject)
    //   return context.updateState(context, {
    //     soundObject: status,
    //     isPlaying: true,

    //   })
    // }
  }

  const handleNext = async () => {
    await changeAudio(context, 'next')

    // const { isLoaded } = await context.playbackObject.getStatusAsync();
    // const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;
    // let audio = context.audioFiles[context.currentAudioIndex + 1];
    // let index;
    // let status;
    // if (!isLoaded && !isLastAudio) {
    //   index = context.currentAudioIndex + 1;
    //   status = await play(context.playbackObject, audio.uri)
    // }

    // if (isLoaded && !isLastAudio) {
    //   index = context.currentAudioIndex + 1;
    //   status = await playNext(context.playbackObject, audio.uri)
    // }

    // if(isLastAudio){
    //   index = 0;
    //   audio = context.audioFiles[0];
    //   if(isLoaded){
    //     status = await playNext(context.playbackObject, audio.uri)
    //   }else{
    //     status = await play(context.playbackObject, audio.uri)

    //   }

    // }

    // context.updateState(context,
    //   { playbackObject: context.playbackObject, soundObject: status, currentAudio: audio, isPlaying: true, currentAudioIndex: index, playbackPosition:null,
    //     playbackDuration:null, })
    // storeAudioForNextOpening(audio, index);

  }

  const handlePrev = async () => {
    await changeAudio(context, 'previous')
    // const { isLoaded } = await context.playbackObject.getStatusAsync();
    // const isFirstAudio = context.currentAudioIndex <= 0;
    // let audio = context.audioFiles[context.currentAudioIndex - 1];
    // let index;
    // let status;
    // if (!isLoaded && !isFirstAudio) {
    //   index = context.currentAudioIndex - 1;
    //   status = await play(context.playbackObject, audio.uri)
    // }

    // if (isLoaded && !isFirstAudio) {
    //   index = context.currentAudioIndex - 1;
    //   status = await playNext(context.playbackObject, audio.uri)
    // }

    // if(isFirstAudio){
    //   index = context.totalAudioCount - 1 ;
    //   audio = context.audioFiles[0];
    //   if(isLoaded){
    //     status = await playNext(context.playbackObject, audio.uri)
    //   }else{
    //     status = await play(context.playbackObject, audio.uri)

    //   }

    // }

    // context.updateState(context,
    //   { playbackObject: context.playbackObject, soundObject: status, currentAudio: audio, isPlaying: true, currentAudioIndex: index, playbackPosition:null,
    //     playbackDuration:null, })
    // storeAudioForNextOpening(audio, index);

  }

  const renderCurrentTime = () => {
    if(!context.soundObj && currentAudio.lastPositon){
      return convertTime(currentAudio.lastPositon / 1000)

    }
    return convertTime(context.playbackPosition / 1000)
  }

  if (!context.currentAudio) return null

  return (
    <>
      <View style={styles.container}>

          <Text style={styles.heading}>Melophile</Text>

          {context.isPlaylistRunning && (<View style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center' }}>
            <Text style={{ fontWeight: 'bold' }}>From Playlist: </Text>
            <Text>{context.activePlaylist.title}</Text>
          </View>)}

          <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1 } / ${context.audioCount}`}</Text>
       

        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons name="music-circle" size={300} color="#181c3f" />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={2} style={styles.audioTitle}>{context.currentAudio.filename}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
            <Text>{currentPosition ? currentPosition : renderCurrentTime()}</Text>
            <Text>{convertTime(context.currentAudio.duration)}</Text>
          </View>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekbar()}
            minimumTrackTintColor={colors.FONT_LIGHT}
            maximumTrackTintColor="#181c3f"
            onValueChange={(value) => {
              setCurrentPosition(convertTime(value * context.currentAudio.duration))
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying) return
              try {
                await pause(context.playbackObject)
              } catch (err) {
                console.log('err inside slider onslide start')
              }
            }}
            onSlidingComplete={async value => {
              await MoveAudio(context, value)
              setCurrentPosition(0)
            }}
          />
          <View style={styles.audioControllers}>
            <PlayerButton onPress={handlePrev} iconType={"PREV"} />
            <PlayerButton onPress={handlePlayPause} style={{ marginHorizontal: 50 }} iconType={context.isPlaying ? 'PLAY' : 'PAUSE'} />
            <PlayerButton onPress={handleNext} iconType={"NEXT"} />
          </View>
        </View>
      </View>
    </>
  )
}
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 12
  },
  audioControllers: {
    width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  audioCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: 'center',
    color: colors.FONT_LIGHT,
    fontSize: 16,
    fontStyle: 'bold',
    paddingTop: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    color: colors.FONT,
    padding: 15,
  },
});
export default Player