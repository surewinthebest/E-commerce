import { View, Text, Dimensions, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    image: {
        width: screenWidth,
        marginBottom: 10,
    },
});

interface Props {
    uri: string
}

const AutoHeightImage: React.FC<Props> = props => {
    const { uri } = props;
    const [calculatedHeight, setCalculatedHeight] = useState(200);

    useEffect(() => {
        if (!uri) return;

        Image.getSize(
            uri,
            (originalWidth, originalHeight) => {
                const ratio = originalHeight / originalWidth;
                const targetHeight = screenWidth * ratio;
                setCalculatedHeight(targetHeight);
            },
            (error) => {
                console.error("Fail to load the image size:", error);
            }
        );
    }, [uri])

    return (
        <Image
            source={{ uri }}
            style={[styles.image, { height: calculatedHeight }]}
            resizeMode="contain"
        />
    )
}

export default AutoHeightImage