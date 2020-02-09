import React from "react";
import { Image, Dimensions, ScrollView } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";

interface OwnProps {
  imageUrls: string[];
}

export default class ImageViewer extends React.Component<OwnProps> {
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
          style={{ width: 2247 / 4.7, height: 1563 / 4.7 }}
          source={{
            uri: this.props.imageUrls[0]
          }}
        />
      </ScrollView>
      // </ImageZoom>
    );
  }
}
