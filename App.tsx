import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import NoPermission from "./components/no-permission";
import * as Permissions from "expo-permissions";
import { Main } from "./main";
import { AsyncStorage } from "react-native";

export default function App() {
  const [haveRecordingPermissions, setHaveRecordingPermissions] = useState(
    false
  );

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
    return (
      <Main
        sentenceIndex={sentenceIndex}
        setSentenceIndex={setSentenceIndex}
        fileName="Chapter 2 - 1"
        mp3FilePath="https://www.schubert-verlag.de/spektrum/audio/10_spektrum_a2-1.mp3"
        pauses={[
          0,
          3.67306,
          5.84141,
          9.95145,
          16.9,
          26.9111,
          32.8232,
          38.013,
          46.538,
          55.2204,
          59.5655,
          69.9711,
          80.4829,
          87.0944,
          98.2458,
          106.172,
          109.853,
          117.233,
          121.634,
          128.099,
          136.153,
          147.271,
          158.581,
          165.844
        ]}
      />
    );
  }
}
