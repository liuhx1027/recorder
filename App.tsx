import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import NoPermission from "./components/no-permission";
import * as Permissions from "expo-permissions";
import { Main } from "./main";
import { AsyncStorage, Text } from "react-native";

interface SampleAudio {
  name: string;
  url: string;
  pauses: number[];
}

export default function App() {
  const [haveRecordingPermissions, setHaveRecordingPermissions] = useState(
    false
  );

  const [sampleAudios, setSimpleAudios] = useState<SampleAudio[]>(null);

  const [sentenceIndex, _setSentenceIndex] = useState(1);
  const setSentenceIndex = (index: number) => {
    _setSentenceIndex(index);
    AsyncStorage.setItem("CurrentSentenceIndex", index.toString(), _error => {
      if (_error) {
        alert("set CurrentSentenceIndex error");
      }
    });
  };

  useEffect(() => {
    fetch("http://survey.liutaoran.com/meta-data/sample-audios.json")
      .then(async response => {
        // alert(response);
        const audioData = await response.json();
        setSimpleAudios(audioData);
        console.log(audioData);
      })
      .catch(e => {
        alert(e);
        console.log(e);
      });

    Permissions.askAsync(Permissions.AUDIO_RECORDING).then(response => {
      setHaveRecordingPermissions(response.status === "granted");

      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true
      });
    });

    AsyncStorage.getItem("CurrentSentenceIndex", (error, result) => {
      if (!error) {
        if (!!result) _setSentenceIndex(Number(result));
      } else {
        alert("error when getting current index");
      }
    });
  }, []);

  if (!haveRecordingPermissions) {
    return <NoPermission />;
  } else {
    if (!sampleAudios) {
      return <Text>loading...</Text>;
    } else
      return (
        <Main
          sentenceIndex={sentenceIndex}
          setSentenceIndex={setSentenceIndex}
          fileName="Chapter 2 - 1"
          mp3FilePath={sampleAudios[0].url}
          pauses={sampleAudios[0].pauses}
        />
      );
  }
}
