import { Text, View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../Context/AudioProvide';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import AudioListItem from '../Components/AudioListItem';
import OptionModal from '../Components/OptionModal';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext, selectAudio } from '../../misc/audioController';
import { storeAudioForNextOpening } from '../../misc/helper';

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,

    };
    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    i => 'audio',
    (type, dim) => {
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  // onPlaybackStatusUpdate = async (playbackStatus)=>{
  //   // console.log(playbackStatus.positionMillis/playbackStatus.durationMillis)
  //   if(playbackStatus.isLoaded && playbackStatus.isPlaying){
  //     this.context.updateState(this.context, {
  //       playbackPosition:playbackStatus.positionMillis,
  //       playbackDuration:playbackStatus.durationMillis,

  //     })
  //   }
  //   if(playbackStatus.didJustFinish){
  //     const nextAudioIndex = this.context.currentAudioIndex + 1;
  //     //Finished all audio
  //     if(nextAudioIndex >= this.context.totalAudioCount){
  //       this.context.playbackObject.unloadAsync();
  //        this.context.updateState(this.context, {
  //         soundObject:null,
  //         currentAudio:this.context.audioFiles[0],
  //         isPlaying:false,
  //         currentAudioIndex : 0,
  //         playbackDuration:null,
  //         playbackPosition:null
  //       })
  //       return await storeAudioForNextOpening(this.context.audioFiles[0], 0)
  //     }

  //     //Otherwise selecting new audio 
  //     const audio = this.context.audioFiles[nextAudioIndex];
  //     const status = await playNext(this.context.playbackObject, audio.uri)
  //     this.context.updateState(this.context, {
  //       soundObject:status,
  //       currentAudio:audio,
  //       isPlaying:true
  //     })
  //     await storeAudioForNextOpening(audio, nextAudioIndex)
  //   }
  // }

  handleAudioPress = async (audio) => {
    await selectAudio(this.context ,audio)
    // const { playbackObject, soundObject, currentAudio, updateState, audioFiles } = this.context;
    // // Play Audio for the first time
    // if (soundObject === null) {
    //   const playbackObject = new Audio.Sound();
    //   const status = await play(playbackObject, audio.uri)
    //   const index = audioFiles.indexOf(audio)
    //   updateState(this.context, 
    //     { playbackObject: playbackObject, soundObject: status, currentAudio: audio, isPlaying:true, currentAudioIndex:index })
        
    //     playbackObject.setOnPlaybackStatusUpdate(this.context.onPlaybackStatusUpdate)

    //     return storeAudioForNextOpening(audio, index)
    //   // return this.setState({ ...this.state, })
    // }

    // //pause Audio
    // if (soundObject.isLoaded && soundObject.isPlaying && currentAudio.id === audio.id) {
    //   const status = await pause(playbackObject)
    //   return updateState(this.context, { soundObject: status, isPlaying:false })
    //   // return this.setState({ ...this.state, soundObject: status })
    // }

    // //resume Audio
    // if (soundObject.isLoaded && !soundObject.isPlaying && currentAudio.id === audio.id) {
    //   const status = await resume(playbackObject);
    //   return updateState(this.context, { soundObject: status, isPlaying:true })
    // }
    // //Select another audio
    // if (soundObject.isLoaded && currentAudio.id !== audio.id) {
    //   const index = audioFiles.indexOf(audio)
    //   const status = await playNext(playbackObject, audio.uri);
    //   updateState(this.context, { soundObject: status, currentAudio: audio, isPlaying:true, currentAudioIndex:index })
    //   return storeAudioForNextOpening(audio, index)
    // }
  }

  componentDidMount(){
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        isPlaying={extendedState.isPlaying}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
        onAudioPress={() => { this.handleAudioPress(item) }}
      />
    )
  }
  navigateToPlaylist = ()=>{
    this.context.updateState(this.context, {
      addToPlaylist : this.currentItem
    })
    this.props.navigation.navigate('Playlist')
  }

  render() {
    return <AudioContext.Consumer>
      {({ dataProvider, isPlaying }) => {
        if(!dataProvider._data.length) return null
        return <View style={{ flex: 1, paddingLeft:7 }}>

          <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRenderer} extendedState={{isPlaying}} />

          <OptionModal options={[{title:'Add to Playlist', onPress: this.navigateToPlaylist }]} currentItem={this.currentItem} onClose={() => { this.setState({ ...this.state, optionModalVisible: false }) }} visible={this.state.optionModalVisible}
            />
        </View>

      }}
    </AudioContext.Consumer>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioList