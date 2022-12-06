import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../Context/AudioProvide';
import {RecyclerListView, LayoutProvider} from 'recyclerlistview'
import AudioListItem from '../Components/AudioListItem';
import OptionModal from '../Components/OptionModal';
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

  rowRenderer = (type, item) => {
    return (
      <AudioListItem title={item.filename} duration={item.duration} onOptionPress={() => {
          this.currentItem = item;
          this.setState({...this.state, optionModalVisible:true});
        }}
      />
    )
  }
  render() {
    return <AudioContext.Consumer>
      {({dataProvider})=>{
        return <View style={{flex:1}}>
             <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRenderer} />
             <OptionModal currentItem={this.currentItem} onClose={()=>{this.setState({...this.state, optionModalVisible:false})}} visible={this.state.optionModalVisible} onPlayPress={()=>{console.log('Playing SOng')}} onPlayListPress={()=>{console.log('Added To Playlist')}} />
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