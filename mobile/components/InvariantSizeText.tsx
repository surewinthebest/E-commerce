import React from "react";
import { Text, TextProps } from "react-native";

const InvariantSizeText: React.FC<TextProps> = props => {
    const { allowFontScaling = false, ...restProps } = props;
    return <Text allowFontScaling={allowFontScaling} {...restProps} />;
};

export default InvariantSizeText;