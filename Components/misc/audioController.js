//play audio

import { storeAudioForNextOpening } from "./helper"

export const play = async (playbackObject, uri, lastPosition) => {
    try {
        if(!lastPosition){
            const status = await playbackObject.loadAsync({ uri }, { shouldPlay: true, processUpdateIntervalMillis: 1000 })
            return status
        }

        //But if there is lastPosition then we will play auidio from the las tposition
        await playbackObject.loadAsync({ uri }, {processUpdateIntervalMillis: 1000 });

        return await playbackObject.playFromPositionAsync(lastPosition)

    } catch (error) {
        console.log('Error inside play() audioController')
    }
}

//pause audio

export const pause = async (playbackObject) => {
    try {
        const status = await playbackObject.setStatusAsync({ shouldPlay: false })
        return status
    } catch (error) {
        console.log('Error inside pause() audioController')
    }
}

//resume audio
export const resume = async (playbackObject) => {
    try {
        const status = await playbackObject.playAsync();
        return status
    } catch (error) {
        console.log('Error inside resume() audioController')
    }
}

//select another audio

export const playNext = async (playbackObject, uri) => {
    try {
        await playbackObject.stopAsync();
        await playbackObject.unloadAsync();
        return await play(playbackObject, uri);
    } catch (error) {
        console.log('error inside playNext helper method', error.message);
    }
}

export const selectAudio = async (context, audio, playlistInfo = {}) => {
    const { playbackObject, soundObject, currentAudio, updateState, audioFiles, onPlaybackStatusUpdate } = context;
    try {
        // Play Audio for the first time
        if (soundObject === null) {
            const status = await play(playbackObject, audio.uri, audio.lastPosition)
            const index = audioFiles.findIndex(({ id }) => id === audio.id)
            updateState(context,
                { soundObject: status, currentAudio: audio, isPlaying: true, currentAudioIndex: index, isPlaylistRunning: false, activePlaylist: [], ...playlistInfo })

            playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)

            return storeAudioForNextOpening(audio, index)
            // return setState({ ...state, })
        }

        //pause Audio
        if (soundObject.isLoaded && soundObject.isPlaying && currentAudio.id === audio.id) {
            const status = await pause(playbackObject)
            return updateState(context, { soundObject: status, isPlaying: false, playbackPosition: status.positionMillis })
            // return setState({ ...state, soundObject: status })
        }

        //resume Audio
        if (soundObject.isLoaded && !soundObject.isPlaying && currentAudio.id === audio.id) {
            const status = await resume(playbackObject);
            return updateState(context, { soundObject: status, isPlaying: true })
        }
        //Select another audio
        if (soundObject.isLoaded && currentAudio.id !== audio.id) {
            const index = audioFiles.findIndex(({ id }) => id === audio.id)
            const status = await playNext(playbackObject, audio.uri);
            updateState(context, { soundObject: status, currentAudio: audio, isPlaying: true, currentAudioIndex: index, isPlaylistRunning: false, activePlaylist: [], ...playlistInfo })
            return storeAudioForNextOpening(audio, index)
        }
    } catch (error) {
        console.log('Errir inside select audio')
    }

}

const selectAudioFromPlaylist = async (context, select) => {
    const {activePlaylist, currentAudio, audioFiles, playbackObject, updateState} = context
    let audio;
    let defaultIndex;
    let nextIndex;

    const indexOnPlayList = activePlaylist.audios.findIndex(
        ({ id }) => id === currentAudio.id
    );
    if(select === 'next'){
        nextIndex = indexOnPlayList + 1;
        defaultIndex = 0;
    }

    if(select === 'previous'){
        nextIndex = indexOnPlayList - 1;
        defaultIndex = activePlaylist.audios.length - 1;
    }

    audio = activePlaylist.audios[nextIndex];

    if (!audio) audio = activePlaylist.audios[defaultIndex];

    const indexOnAllList = audioFiles.findIndex(
        ({ id }) => id === audio.id
    );

    const status = await playNext(playbackObject, audio.uri);
    return updateState(context, {
        soundObj: status,
        isPlaying: true,
        currentAudio: audio,
        currentAudioIndex: indexOnAllList,
    });
}

export const changeAudio = async (context, select) => {
    const { playbackObject, currentAudioIndex, totalAudioCount, audioFiles, updateState, onPlaybackStatusUpdate, isPlaylistRunning } = context

    if (isPlaylistRunning) return selectAudioFromPlaylist(context, select)

    try {
        const { isLoaded } = await playbackObject.getStatusAsync();
        const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
        let audio;
        let index;
        let status;

        //Next
        if (select === 'next') {
            audio = audioFiles[currentAudioIndex + 1];

            if (!isLoaded && !isLastAudio) {
                index = currentAudioIndex + 1;
                status = await play(playbackObject, audio.uri)
                playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)

            }

            if (isLoaded && !isLastAudio) {
                index = currentAudioIndex + 1;
                status = await playNext(playbackObject, audio.uri)
            }

            if (isLastAudio) {
                index = 0;
                audio = audioFiles[0];
                if (isLoaded) {
                    status = await playNext(playbackObject, audio.uri)
                } else {
                    status = await play(playbackObject, audio.uri)

                }

            }
        }
        //For Previous
        if (select === 'previous') {
            audio = audioFiles[currentAudioIndex - 1];
            const isFirstAudio = currentAudioIndex <= 0;
            if (!isLoaded && !isFirstAudio) {
                index = currentAudioIndex - 1;
                status = await play(playbackObject, audio.uri)
                playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)

            }

            if (isLoaded && !isFirstAudio) {
                index = currentAudioIndex - 1;
                status = await playNext(playbackObject, audio.uri)
            }

            if (isFirstAudio) {
                index = totalAudioCount - 1;
                audio = audioFiles[0];
                if (isLoaded) {
                    status = await playNext(playbackObject, audio.uri)
                } else {
                    status = await play(playbackObject, audio.uri)

                }

            }
        }


        updateState(context,
            {
                soundObject: status, currentAudio: audio, isPlaying: true, currentAudioIndex: index, playbackPosition: null,
                playbackDuration: null,
            })
        storeAudioForNextOpening(audio, index);
    } catch (error) {
        console.log('error inside changeAudio ')
    }
}

export const MoveAudio = async (context, value) => {
    const { soundObject, isPlaying, playbackObject, updateState } = context
    if (soundObject === null || !isPlaying) return;
    try {
        const status = await playbackObject.setPositionAsync(Math.floor(soundObject.durationMillis * value));
        updateState(context, { soundObject: status, playbackPosition: status.positionMillis });
        await resume(playbackObject)
    } catch (error) {
        console.log('onslideComplete eror')
    }
}