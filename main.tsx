import React, { useCallback, useState, useEffect } from "react";
import { styles, BACKGROUND_COLOR } from "./App.style";
import {
  Text,
  View,
  TouchableHighlight,
  Slider,
  Image,
  Dimensions,
  Picker
} from "react-native";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Sound } from "expo-av/build/Audio";
import { PlaybackStatus } from "expo-av/build/AV";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import ImageViewer from "./components/ImageViewer";

interface OwnProps {
  mp3FilePath: string;
  fileName: string;
  pauses: number[];
  sentenceIndex: number;
  setSentenceIndex: (index: number) => void;
}

let SAMPLE_SOUND: Sound = null;
function SampleAudio(props: OwnProps) {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const [duration, setDuration] = useState(1);

  const setSentenceIndex = (index: number) => {
    props.setSentenceIndex(index);

    const startPosition = props.pauses[index] * 1000;
    SAMPLE_SOUND.setPositionAsync(startPosition);
    setSliderPosition(startPosition / duration);
  };

  if (SAMPLE_SOUND === null) {
    SAMPLE_SOUND = new Sound();
    SAMPLE_SOUND.loadAsync({
      uri: props.mp3FilePath
    })
      .then((value: PlaybackStatus) => {
        SAMPLE_SOUND.setProgressUpdateIntervalAsync(200);
        if (value.isLoaded) {
          setDuration(value.durationMillis);
          setSentenceIndex(props.sentenceIndex);
        }
      })
      .catch(e => {
        alert("error loading sound" + e);
      });
  }

  const playOrPause = useCallback(
    (alwayPlay: boolean = false) => {
      SAMPLE_SOUND.getStatusAsync().then(status => {
        if (status.isLoaded === false) return;

        if (status.isPlaying && !alwayPlay) {
          SAMPLE_SOUND.pauseAsync();
        } else {
          SAMPLE_SOUND.playFromPositionAsync(
            props.pauses[props.sentenceIndex] * 1000
          );
        }
      });
    },
    [props.sentenceIndex]
  );

  useEffect(() => {
    if (SAMPLE_SOUND) {
      SAMPLE_SOUND.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          setSliderPosition(status.positionMillis / status.durationMillis);
          setPositionMillis(status.positionMillis);

          if (
            status.positionMillis >=
            props.pauses[props.sentenceIndex + 1] * 1000
          ) {
            SAMPLE_SOUND.pauseAsync();
          }
        }
      });
      playOrPause(true);
    }
  }, [props.sentenceIndex]);

  return (
    <>
      <Text style={{ fontSize: 16 }}>{props.fileName}</Text>
      <View style={[styles.rowContainer, { flex: 3 }]}>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            onPress={() => {
              setSentenceIndex(props.sentenceIndex - 1);
            }}
          >
            <AntDesign name="stepbackward" size={32} />
          </TouchableHighlight>
        </View>
        <View style={{ flex: 3, alignItems: "center" }}>
          <Picker
            selectedValue={props.sentenceIndex}
            onValueChange={index => {
              setSentenceIndex(index);
            }}
            style={{ width: 160 }}
            mode="dialog"
          >
            {props.pauses.map((value, index) =>
              value === 0 ? null : (
                <Picker.Item
                  key={index}
                  label={`${index}/${props.pauses.length}`}
                  value={index}
                />
              )
            )}
          </Picker>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            onPress={() => {
              setSentenceIndex(props.sentenceIndex + 1);
            }}
          >
            <AntDesign name="stepforward" size={32} />
          </TouchableHighlight>
        </View>
      </View>
      <View />
      <View
        style={{
          flex: 2,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          backgroundColor: "grey"
        }}
      >
        <Slider
          style={styles.playbackSlider}
          value={sliderPosition}
          onValueChange={() => {}}
          thumbTintColor="black"
          maximumTrackTintColor="black"
          minimumTrackTintColor="white"
        />
        <Text style={{ alignSelf: "flex-end" }}>
          {(positionMillis / 1000).toFixed(2)}
        </Text>
      </View>
    </>
  );
}

let RECORDING: Audio.Recording = null;
let SOUND: Audio.Sound = null;
function RecordingAndPlayback({
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

export function Main(props: OwnProps) {
  return (
    <View style={styles.container}>
      {/* status bar */}
      <View style={{ height: Constants.statusBarHeight }} />

      {/* audio file switch container */}
      <View
        style={[
          {
            flex: 3,
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "stretch",
            justifyContent: "center"
          },
          { backgroundColor: "yellow" }
        ]}
      >
        <SampleAudio {...props} />
      </View>

      {/* picture */}
      <View
        style={[
          {
            flex: 5,
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "stretch",
            justifyContent: "center"
          }
        ]}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "blue",
            alignSelf: "stretch",
            alignItems: "center"
            // alignContent: "center"
          }}
        >
          {/* <Image
            style={{ width: Dimensions.get("window").width, height: 280 }}
            source={require("./assets/sample-image.jpg")}
          /> */}
          <ImageViewer />
          {/* <Text style={{ backgroundColor: "pink" }}>Picture</Text> */}
        </View>
      </View>

      {/* recording, play recording, play sample */}
      <View
        style={{
          flex: 2,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch"
        }}
      >
        <RecordingAndPlayback
          onPlaySampleSoundClicked={() => {
            SAMPLE_SOUND.playFromPositionAsync(
              props.pauses[props.sentenceIndex] * 1000
            );
          }}
        />
        <View />
      </View>
    </View>
  );
}
