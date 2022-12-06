//play audio

export const play = async (playbackObject, uri)=>{
    try {
        const status = await playbackObject.loadAsync({ uri }, { shouldPlay: true })
        return status
    } catch (error) {
        console.log('Error inside play() audioController')
    }
}

//pause audio

export const pause = async (playbackObject)=>{
    try {
        const status = await playbackObject.setStatusAsync({shouldPlay:false})
        return status
    } catch (error) {
        console.log('Error inside pause() audioController')
    }
}

//resume audio
export const resume = async (playbackObject)=>{
    try {
        const status = await playbackObject.playAsync();
        return status
    } catch (error) {
        console.log('Error inside resume() audioController')
    }
}

//select another audio

export const playNext = async (playbackObject, uri)=>{
    try {
        await playbackObject.stopAsync();
        await playbackObject.unloadAsync();
        return await play(playbackObject, uri);
    } catch (error) {
        console.log('Error inside playNext() audioController')

    }
}