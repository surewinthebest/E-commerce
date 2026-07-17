import { TextProps, StyleSheet } from "react-native";
import React from "react";
import InvariantSizeText from "./InvariantSizeText";
import { Font, Typography } from "@/models/Font";

interface Props extends TextProps {
    typography?: Typography;
}

export const textStyle: { [key in Typography]: {
    fontFamily: Font,
    fontSize: number,
    lineHeight: number,
    fontWeight?: "400" | "700" | "900"
} } = StyleSheet.create({
    [Typography.text5Xs]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 4,
        lineHeight: 5,
        fontWeight: "400"
    },
    [Typography.text5XsB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 4,
        lineHeight: 5,
        fontWeight: "700"
    },
    [Typography.text4Xs]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 6,
        lineHeight: 7,
        fontWeight: "400"
    },
    [Typography.text4XsB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 6,
        lineHeight: 7,
        fontWeight: "700"
    },
    [Typography.text3Xs]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 8,
        lineHeight: 10,
        fontWeight: "400"
    },
    [Typography.text3XsB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 8,
        lineHeight: 10,
        fontWeight: "700"
    },
    [Typography.text2Xs]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 10,
        lineHeight: 12,
        fontWeight: "400"
    },
    [Typography.text2XsB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 10,
        lineHeight: 12,
        fontWeight: "700"
    },
    [Typography.textXs]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 12,
        lineHeight: 15,
        fontWeight: "400"
    },
    [Typography.textXsB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 12,
        lineHeight: 15,
        fontWeight: "700"
    },
    [Typography.textSm]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "400"
    },
    [Typography.textSmB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "700"
    },
    [Typography.textBase]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "400"
    },
    [Typography.textBaseB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "700"
    },
    [Typography.textLg]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 18,
        lineHeight: 22.5,
        fontWeight: "400"
    },
    [Typography.textLgB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 18,
        lineHeight: 22.5,
        fontWeight: "700"
    },
    [Typography.textXl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 20,
        lineHeight: 25,
        fontWeight: "400"
    },
    [Typography.textXlB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 20,
        lineHeight: 25,
        fontWeight: "700"
    },
    [Typography.text2Xl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 24,
        lineHeight: 36,
        fontWeight: "400"
    },
    [Typography.text2XlB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 24,
        lineHeight: 28.8,
        fontWeight: "700"
    },
    [Typography.text3Xl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 28,
        lineHeight: 38,
        fontWeight: "400"
    },
    [Typography.text3XlB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 28,
        lineHeight: 38,
        fontWeight: "700"
    },
    [Typography.text4Xl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 36,
        lineHeight: 45,
        fontWeight: "400"
    },
    [Typography.text4Point5Xl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 40,
        lineHeight: 48,
    },
    [Typography.text4Point5XlB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 40,
        lineHeight: 48,
        fontWeight: "700"
    },
    [Typography.text4Point5XlBlack]: {
        fontFamily: Font.NunitoSansBlack,
        fontSize: 40,
        lineHeight: 48,
        fontWeight: "900",
    },
    [Typography.text5Xl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 48,
        lineHeight: 48,
        fontWeight: "400"
    },
    [Typography.text5XlB]: {
        fontFamily: Font.NunitoSansBold,
        fontSize: 48,
        lineHeight: 48,
        fontWeight: "700"
    },
    [Typography.text6Xl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 60,
        lineHeight: 60,
        fontWeight: "400"
    },
    [Typography.text7Xl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 72,
        lineHeight: 72,
        fontWeight: "400"
    },
    [Typography.text8Xl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 96,
        lineHeight: 96,
        fontWeight: "400"
    },
    [Typography.text9Xl]: {
        fontFamily: Font.NunitoSansRegular,
        fontSize: 128,
        lineHeight: 128,
        fontWeight: "400"
    },
});

const AppText: React.FC<Props> = (props) => {
    const { style, typography = Typography.textBase, ...restProps } = props;
    return (
        <InvariantSizeText style={[style, textStyle[typography]]} {...restProps} />
    )
};

export default AppText;