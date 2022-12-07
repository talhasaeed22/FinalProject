import { Text, View, Alert } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
export const AudioContext = createContext();
export class AudioProvide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObject: null,
      soundObject: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    }
    this.audioCount = 0;
  }

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem('previousAudio');
    let currentAudio;
    let currentAudioIndex;

    if (previousAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  permissionALert = () => {
    Alert.alert('Permission Requried', 'This app needs to read audio files! ', [{
      text: 'Allow',
      onPress: () => this.getPermission()
    }, {
      text: 'Cancel',
      onPress: () => this.permissionALert()
    }])
  }

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio'
    })
    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: media.totalCount
    })
    this.audioCount = media.totalCount;

    this.setState({ ...this.state, dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]), audioFiles: [...audioFiles, ...media.assets] })
    console.log(media.assets.length);
  }

  getPermission = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    console.log(permission);
    if (!permission.granted) {
      this.getAudioFiles();
    }
    if (permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'denied' && canAskAgain) {
        //Display Alert that user must allow this permission to work this app
        this.permissionALert();
      }

      if (status === 'granted') {
        this.getAudioFiles();
      }

      if (status === 'denied' && !canAskAgain) {
        //Display Alert that user must allow this permission to work this app
        this.setState({ ...this.state, permissionError: true })
      }

    }
  }
  componentDidMount() {
    this.getPermission();
    if(this.state.playbackObject === null){
      this.setState({...this.state, playbackObject:new Audio.Sound()})
    }
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState })
  }
  render() {
    const { dataProvider, audioFiles, playbackObject, soundObject, currentAudio, isPlaying, currentAudioIndex, playbackPosition,
      playbackDuration, } = this.state;

    if (this.state.permissionError) {
      return <View>
        <Text>It looks like you havent accepted the permission</Text>
      </View>
    }
    return (
      <AudioContext.Provider value={{ audioFiles, dataProvider, playbackObject, soundObject, currentAudio, updateState: this.updateState, isPlaying, currentAudioIndex, audioCount: this.audioCount, playbackPosition, playbackDuration,loadPreviousAudio:this.loadPreviousAudio }}>
        {this.props.children}
      </AudioContext.Provider>
    )
  }
}

export default AudioProvide