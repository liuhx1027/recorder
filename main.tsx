import React, { useState } from "react";
import { styles } from "./App.style";
import { View, Text } from "react-native";

import Constants from "expo-constants";
import { Sound } from "expo-av/build/Audio";
import { PlaybackStatus } from "expo-av/build/AV";
import ImageViewer from "./components/ImageViewer";
import { RecordingAndPlayback } from "./components/RecordingAndPlayback";
import { SampleAudio } from "./components/SampleAudio";

interface OwnProps {
  mp3FilePath: string;
  imageUrls: string[];
  fileName: string;
  pauses: number[];
  sentenceIndex: number;
  setSentenceIndex: (index: number) => void;
}

let SAMPLE_SOUND: Sound = null;

export function Main(props: OwnProps) {
  const [isSoundLoaded, setIsSoundLoaded] = useState(false);

  if (SAMPLE_SOUND === null) {
    SAMPLE_SOUND = new Sound();
    SAMPLE_SOUND.loadAsync({
      uri: props.mp3FilePath
    })
      .then((value: PlaybackStatus) => {
        SAMPLE_SOUND.setProgressUpdateIntervalAsync(200);
        setIsSoundLoaded(true);
      })
      .catch(e => {
        alert("error loading sound" + e);
      });
  }

  if (isSoundLoaded === false) {
    return <Text>loading sound...</Text>;
  } else {
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
          <SampleAudio {...props} SAMPLE_SOUND={SAMPLE_SOUND} />
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
            <ImageViewer imageUrls={props.imageUrls} />
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
}
