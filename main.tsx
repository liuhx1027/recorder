import React, { useCallback, useState } from "react";
import { styles, BACKGROUND_COLOR } from "./App.style";
import { Text, View, TouchableHighlight, Slider } from "react-native";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Sound } from "expo-av/build/Audio";
import { PlaybackStatus } from "expo-av/build/AV";

interface OwnProps {
  mp3FilePath: string;
  fileName: string;
  pauses: number[];
  sentenceIndex: number;
  setSentenceIndex: (index: number) => void;
}

let SAMPLE_SOUND: Sound = null;
function SampleAudio(props: OwnProps) {
  const [sliderPosition, setSliderPostion] = useState(0);

  if (SAMPLE_SOUND === null) {
    SAMPLE_SOUND = new Sound();
    SAMPLE_SOUND.loadAsync({
      uri: props.mp3FilePath
    })
      .then((value: PlaybackStatus) => {
        if (value.isLoaded) {
          const startPosition = props.pauses[props.sentenceIndex] * 1000;
          SAMPLE_SOUND.playFromPositionAsync(startPosition);
          // setSliderPostion(startPosition / value.durationMillis);
          SAMPLE_SOUND.setOnPlaybackStatusUpdate(status => {
            if (status.isLoaded)
              setSliderPostion(status.positionMillis / status.durationMillis);
          });
        }
      })
      .catch(e => {
        alert("error loading sound" + e);
      });
  }

  const playOrPause = useCallback(() => {
    SAMPLE_SOUND.getStatusAsync().then(status => {
      if (status.isLoaded === false) return;

      if (status.isPlaying) {
        SAMPLE_SOUND.pauseAsync();
      } else {
        SAMPLE_SOUND.playAsync();
      }
    });
  }, []);

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
              props.setSentenceIndex(props.sentenceIndex - 1);
            }}
          >
            <AntDesign name="stepbackward" size={32} />
          </TouchableHighlight>
        </View>
        <View style={{ flex: 3, alignItems: "center" }}>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            onPress={() => {
              playOrPause();
            }}
          >
            <Text style={{ fontSize: 32 }}>
              {`${props.sentenceIndex}/${props.pauses.length.toString()}`}
            </Text>
          </TouchableHighlight>
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
              props.setSentenceIndex(props.sentenceIndex + 1);
            }}
          >
            <AntDesign name="stepforward" size={32} />
          </TouchableHighlight>
        </View>
      </View>
      <View />
      <View
        style={{
          flex: 1,
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
      </View>
    </>
  );
}

function RecordingAndPlayback() {
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
          onPress={() => {}}
          // disabled={this.state.isLoading}
        >
          <MaterialCommunityIcons
            name="microphone"
            size={64}
            // color={this.state.isRecording ? "red" : "black"}
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
          onPress={() => {}}
          // disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
        >
          <MaterialCommunityIcons name={"play"} size={64} />
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
            // this._playCurrent();
          }}
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
          <Text style={{ backgroundColor: "pink" }}>Picture</Text>
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
        <RecordingAndPlayback />
        <View />
      </View>
    </View>
  );
}
