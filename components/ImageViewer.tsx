import React from "react";
import { Image, Dimensions } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";

export default class App extends React.Component {
  render() {
    return (
      <ImageZoom
        cropWidth={Dimensions.get("window").width}
        cropHeight={273}
        imageWidth={Dimensions.get("window").width}
        imageHeight={273}
      >
        <Image
          style={{ width: 1512/4.7, height: 1297/4.7 }}
          source={{
            uri:
              "http://survey.liutaoran.com/meta-data/sample-image.jpg"
          }}
        />
      </ImageZoom>
    );
  }
}
