import { Text, View, Alert } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../../misc/helper';
import { playNext } from '../../misc/audioController';
export const AudioContext = createContext();
export class AudioProvide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      audioFiles: [],
      playlist: [],
      addToPlaylist: null,
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObject: null,
      soundObject: null,
      currentAudio: {},
      isPlaying: false,
      isPlaylistRunning:false,
      activePlaylist:[],
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

  onPlaybackStatusUpdate = async playbackStatus => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }

    if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
      storeAudioForNextOpening(
        this.state.currentAudio,
        this.state.currentAudioIndex,
        playbackStatus.positionMillis
      );
    }

    if (playbackStatus.didJustFinish) {
      if (this.state.isPlaylistRunning) {
        let audio;
        const indexOnPlayList = this.state.activePlaylist.audios.findIndex(
          ({ id }) => id === this.state.currentAudio.id
        );
        const nextIndex = indexOnPlayList + 1;
        audio = this.state.activePlaylist.audios[nextIndex];

        if (!audio) audio = this.state.activePlaylist.audios[0];

        const indexOnAllList = this.state.audioFiles.findIndex(
          ({ id }) => id === audio.id
        );

        const status = await playNext(this.state.playbackObject, audio.uri);
        return this.updateState(this, {
          soundObj: status,
          isPlaying: true,
          currentAudio: audio,
          currentAudioIndex: indexOnAllList,
        });
      }

      const nextAudioIndex = this.state.currentAudioIndex + 1;
      // there is no next audio to play or the current audio is the last
      if (nextAudioIndex >= this.totalAudioCount) {
        this.state.playbackObject.unloadAsync();
        this.updateState(this, {
          soundObj: null,
          currentAudio: this.state.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
        return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
      }
      // otherwise we want to select the next audio
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await playNext(this.state.playbackObject, audio.uri);
      this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
  };

  // onPlaybackStatusUpdate = async (playbackStatus)=>{
  //   // console.log(playbackStatus.positionMillis/playbackStatus.durationMillis)
  //   try {
  //     if(playbackStatus.isLoaded && playbackStatus.isPlaying){
  //       this.updateState(this, {
  //         playbackPosition:playbackStatus.positionMillis,
  //         playbackDuration:playbackStatus.durationMillis,
  
  //       })
  //     }

  //     if(playbackStatus.isLoaded && !playbackStatus.isPlaying){
  //       storeAudioForNextOpening(
  //         this.state.currentAudio,
  //         playbackStatus.positionMillis,
  //         this.state.currentAudioIndex
  //       );
  //     }

  //     if(playbackStatus.didJustFinish){
  //       const nextAudioIndex = this.state.currentAudioIndex + 1;
  //       //Finished all audio
  //       if(nextAudioIndex >= this.state.totalAudioCount){
  //         this.state.playbackObject.unloadAsync();
  //          this.updateState(this, {
  //           soundObject:null,
  //           currentAudio:this.state.audioFiles[0],
  //           isPlaying:false,
  //           currentAudioIndex : 0,
  //           playbackDuration:null,
  //           playbackPosition:null
  //         })
  //         return await storeAudioForNextOpening(this.state.audioFiles[0], 0)
  //       }
  
  //       //Otherwise selecting new audio 
  //       const audio = this.state.audioFiles[nextAudioIndex];
  //       const status = await playNext(this.context.playbackObject, audio.uri)
  //       this.updateState(this, {
  //         soundObject:status,
  //         currentAudio:audio,
  //         isPlaying:true
  //       })
  //       await storeAudioForNextOpening(audio, nextAudioIndex)
  //     }
  //   } catch (error) {
  //     console.log('error inside didfinished context')
  //   }
  // }
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
      playbackDuration, playlist, addToPlaylist, isPlaylistRunning, activePlaylist } = this.state;

    if (this.state.permissionError) {
      return <View>
        <Text>It looks like you havent accepted the permission</Text>
      </View>
    }
    return (
      <AudioContext.Provider value={{ audioFiles, playlist, addToPlaylist, dataProvider, playbackObject, soundObject, currentAudio, updateState: this.updateState, isPlaying, currentAudioIndex, audioCount: this.audioCount, playbackPosition, playbackDuration,loadPreviousAudio:this.loadPreviousAudio ,onPlaybackStatusUpdate:this.onPlaybackStatusUpdate, isPlaylistRunning, activePlaylist}}>
        {this.props.children}
      </AudioContext.Provider>
    )
  }
}

export default AudioProvide