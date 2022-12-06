import { View, Text } from 'react-native'
import React from 'react'
import colors from '../../misc/colors'
import AntDesign from 'react-native-vector-icons/AntDesign'
const PlayerButton = (props) => {
    const { iconType, size = 40, color = '#181c3f', onPress, otherProps } = props;
    const getIconName = (iconType) => {
        switch (iconType) {
            case 'PLAY':
                return 'pausecircle';
            case 'PAUSE':
                return 'playcircleo';
            case 'NEXT':
                return 'forward';
            case 'PREV':
                return 'banckward';
        }
    }
    return (
        <AntDesign {...props} onPress={onPress} name={getIconName(iconType)} size={size} color={color} {...otherProps} />
    )
}

export default PlayerButton