import React, { useState } from "react";
import { styles, BACKGROUND_COLOR } from "../App.style";
import { View, TouchableHighlight } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

let RECORDING: Audio.Recording = null;
let SOUND: Audio.Sound = null;

export function RecordingAndPlayback({
  onPlaySampleSoundClicked
}: {
  onPlaySampleSoundClicked: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const onRecordPressed = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true
    });

    if (RECORDING !== null) {
      const status = await RECORDING.getStatusAsync();
      if (status.isRecording) {
        await RECORDING.stopAndUnloadAsync();
        const info = await FileSystem.getInfoAsync(RECORDING.getURI());
        console.log(`FILE INFO: ${JSON.stringify(info)}`);
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          // playsInSilentLockedModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: true
        });
        const { sound, status } = await RECORDING.createNewLoadedSoundAsync(
          {
            isLooping: false,
            isMuted: false,
            volume: 1,
            rate: 1,
            shouldCorrectPitch: true
          },
          status => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
            }
          }
        );
        SOUND = sound;

        return;
      } else {
        RECORDING.setOnRecordingStatusUpdate(null);
        RECORDING = null;
      }
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY))
    );
    recording.setOnRecordingStatusUpdate(status => {
      if (status.canRecord) {
        setIsRecording(status.isRecording);
      } else if (status.isDoneRecording) {
        setIsRecording(false);
      }
    });

    RECORDING = recording;
    await RECORDING.startAsync();
  };

  return (
    <View
      style={[
        {
          flex: 4,
          flexDirection: "row",
          paddingRight: 20,
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "green"
        }
      ]}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={[styles.wrapper]}
          onPress={onRecordPressed}
          // disabled={this.state.isLoading}
        >
          <MaterialCommunityIcons
            name="microphone"
            size={64}
            color={isRecording ? "red" : "black"}
          />
        </TouchableHighlight>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={() => {
            if (SOUND !== null) SOUND.playFromPositionAsync(0);
          }}
          // disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
        >
          <MaterialCommunityIcons
            name={isPlaying ? "pause" : "play"}
            size={64}
          />
        </TouchableHighlight>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <TouchableHighlight
          underlayColor={BACKGROUND_COLOR}
          style={styles.wrapper}
          onPress={onPlaySampleSoundClicked}
        >
          <MaterialCommunityIcons name="redo" size={64} />
        </TouchableHighlight>
      </View>
    </View>
  );
}
