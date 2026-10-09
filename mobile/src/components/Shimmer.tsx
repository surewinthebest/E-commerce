import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Color } from '@/src/models/Color';

interface ShimmerProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

const Shimmer: React.FC<ShimmerProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  return (
    <ImageBackground
      source={require('@/src/assets/images/shimmer.gif')}
      style={[
        styles.shimmer,
        { width, height, borderRadius },
        style,
      ]}
      imageStyle={{ borderRadius, opacity: 0.25 }}
    />
  );
};

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: Color.ProfileGray,
    overflow: 'hidden',
  },
});

export default React.memo(Shimmer);