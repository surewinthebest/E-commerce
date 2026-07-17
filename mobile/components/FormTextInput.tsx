import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import AppText from "./AppText";
import { Color } from "@/models/Color";
import { Typography } from "@/models/Font";
import { AddressFormTextInput } from "@/types";

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        marginVertical: 5
    },
    label: {
        color: Color.White,
        paddingVertical: 7
    },
    textInputContainer: {
        height: 45,
        borderRadius: 15,
        backgroundColor: Color.ProfileGray
    },
    textInput: {
        height: 50,
        borderRadius: 15,
        paddingHorizontal: 15,
        backgroundColor: Color.ProfileGray,
        color: Color.White
    }
});

interface Props {
    formInfo: AddressFormTextInput;
}

const FormTextInput: React.FC<Props> = props => {
    const { formInfo } = props;
    return (
        <View style={styles.container}>
            {formInfo?.label ? <AppText style={styles.label} typography={Typography.textSmB}>{formInfo.label}</AppText> : null}
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholderTextColor={Color.Grey + "80"}
                    placeholder={formInfo.placeholder}
                    value={formInfo.value}
                    onChangeText={(v) => formInfo.action(v)} /></View>
        </View>
    )
}

export default FormTextInput;