import React, { Component, useContext, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import colors from '../../misc/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../Components/PlayerButton';
import {AudioContext} from '../Context/AudioProvide'

const Player = () => {
  const { width } = Dimensions.get('window');
const context = useContext(AudioContext)
const {
  audioCount,
  currentAudioIndex,
  playbackDuration,
  playbackPosition
} = context;
const [seekbar, setSeekbar] = useState(null);

const calculateSeekbar = () => {
  if (playbackPosition !== null && playbackDuration !== null) {
    return playbackPosition / playbackDuration;
  }

  return 0;
};

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.audioCount}>{currentAudioIndex + 1}/{audioCount}</Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons name="music-circle" size={300} color="#181c3f" />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={2} style={styles.audioTitle}>{context.currentAudio.filename}</Text>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekbar()}
            minimumTrackTintColor={colors.FONT_LIGHT}
            maximumTrackTintColor="#181c3f"
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType={"PREV"} />
            <PlayerButton onPress={()=>{console.log('Working')}} style={{marginHorizontal:50}} iconType={context.isPlaying ? 'PLAY' : 'PAUSE'} />
            <PlayerButton iconType={"NEXT"} />
          </View>
        </View>
      </View>
    </>
  )
}
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
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
    textAlign: 'right',
    color: colors.FONT_LIGHT,
    fontSize: 14,
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