import React from "react";
import { Image, Dimensions, ScrollView } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";

export default class App extends React.Component {
  render() {
    // console.log(Dimensions.get("window").width);
    return (
      // <ImageZoom
      //   cropWidth={Dimensions.get("window").width}
      //   cropHeight={273}
      //   imageWidth={950}
      //   imageHeight={273}
      // >
      <ScrollView horizontal={true}>
        <Image
          style={{ width: 2874 / 4.7, height: 1293 / 4.7 }}
          source={{
            uri: "http://survey.liutaoran.com/meta-data/a2-1-14.jpg"
          }}
        />
      </ScrollView>
      // </ImageZoom>
    );
  }
}
