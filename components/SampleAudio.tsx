import React, { useState, useEffect } from "react";
import { styles, BACKGROUND_COLOR } from "../App.style";
import { Text, View, TouchableHighlight, Slider, Picker } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Sound } from "expo-av/build/Audio";

interface OwnProps {
  mp3FilePath: string;
  fileName: string;
  pauses: number[];
  SAMPLE_SOUND: Sound;
  sentenceIndex: number;
  setSentenceIndex: (index: number) => void;
}

export function SampleAudio(props: OwnProps) {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const [duration, setDuration] = useState(1);

  const setSentenceIndex = (index: number) => {
    props.setSentenceIndex(index);

    const startPosition = props.pauses[index] * 1000;

    // props.SAMPLE_SOUND.getStatusAsync().then(status => {
    //   if (status.isLoaded) {
    props.SAMPLE_SOUND.setPositionAsync(startPosition);
    //   }
    // });
    setSliderPosition(startPosition / duration);
  };

  useEffect(() => {
    setSentenceIndex(props.sentenceIndex);

    props.SAMPLE_SOUND.setOnPlaybackStatusUpdate(null);
    props.SAMPLE_SOUND.setOnPlaybackStatusUpdate(status => {
      if (status.isLoaded) {
        setSliderPosition(status.positionMillis / status.durationMillis);
        setPositionMillis(status.positionMillis);
        setDuration(status.durationMillis);

        if (
          status.positionMillis >=
          props.pauses[props.sentenceIndex + 1] * 1000
        ) {
          props.SAMPLE_SOUND.pauseAsync();
        }
      }
    });
    props.SAMPLE_SOUND.playAsync();
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
