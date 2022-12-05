import { Text, View, StyleSheet, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../Context/AudioProvide';

export class AudioList extends Component {
  static contextType = AudioContext;
  render() {
    return (
      <>
      <View>
        <Text style={{textAlign:"center", fontSize:19, color:'red', fontWeight:'bold'}}>Songs</Text>
      </View>
      <ScrollView >
        {this.context.audioFiles.map((item)=><Text style={{padding:14,paddingTop:14, paddingBottom:14 ,borderTopWidth:1}} key={item.id}>{item.filename}</Text>)}
          <Text >AudioList</Text>
      </ScrollView>
      </>
    )
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