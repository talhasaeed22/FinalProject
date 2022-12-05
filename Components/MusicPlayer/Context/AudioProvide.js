import { Text, View, Alert } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library';
export const AudioContext = createContext();
export class AudioProvide extends Component {
    constructor(props){
        super(props)
        this.state = {
          audioFiles : [],
          permissionError:false
        }
    }

    permissionALert = ()=>{
      Alert.alert('Permission Requried', 'This app needs to read audio files! ', [{
        text:'Allow',
        onPress: ()=>this.getPermission()
      }, {
        text:'Cancel',
        onPress: ()=> this.permissionALert()
      }])
    }

    getAudioFiles = async ()=>{
      let media = await MediaLibrary.getAssetsAsync({
        mediaType:'audio'
      })
      media = await MediaLibrary.getAssetsAsync({
        mediaType:'audio',
        first:media.totalCount
      })
      this.setState({...this.state, audioFiles:media.assets})
      console.log(media.assets.length);
    }

    getPermission = async ()=>{
      const permission = await MediaLibrary.requestPermissionsAsync();
      console.log(permission);
      if(!permission.granted){
        this.getAudioFiles();
      }
      if(permission.granted && permission.canAskAgain){
        const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync();
        if(status === 'denied' && canAskAgain){
          //Display Alert that user must allow this permission to work this app
          this.permissionALert();
        }

        if(status === 'granted'){
          this.getAudioFiles();
        }

        if(status === 'denied' && !canAskAgain){
          //Display Alert that user must allow this permission to work this app
          this.setState({...this.state, permissionError:true})
        }

      }
    }
    componentDidMount(){
      this.getPermission();
    }
  render() {
    if(this.state.permissionError){
      return <View>
        <Text>It looks like you havent accepted the permission</Text>
      </View>
    }
    return (
      <AudioContext.Provider value={{audioFiles:this.state.audioFiles}}>
        {this.props.children}
      </AudioContext.Provider>
    )
  }
}

export default AudioProvide