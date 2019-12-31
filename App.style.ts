import { StyleSheet, Dimensions } from "react-native";
import Constants from "expo-constants";

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

export const BACKGROUND_COLOR = "#FFF8ED";
export const LIVE_COLOR = "#FF0000";
export const DISABLED_OPACITY = 0.5;
export const RATE_SCALE = 3.0;

export const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
    minHeight: DEVICE_HEIGHT,
    maxHeight: DEVICE_HEIGHT
  },
  noPermissionsText: {
    textAlign: "center"
  },
  wrapper: {},
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-between",
    alignItems: "center"
  },
  oneThirdScreenContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    // alignContent: "stretch",
    // backgroundColor:"grey",
    minHeight: (DEVICE_HEIGHT - Constants.statusBarHeight) / 3.0,
    maxHeight: (DEVICE_HEIGHT - Constants.statusBarHeight) / 3.0
  },
  playbackSlider: {
    alignSelf: "stretch"
  },
  liveText: {
    color: LIVE_COLOR
  },
  recordingTimestamp: {
    paddingLeft: 20
  },
  playbackTimestamp: {
    textAlign: "right",
    alignSelf: "stretch",
    paddingRight: 20
  },
  image: {
    backgroundColor: BACKGROUND_COLOR
  },
  textButton: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 10
  },
  buttonsContainerBase: {
    flex: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  volumeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0
  }
});
