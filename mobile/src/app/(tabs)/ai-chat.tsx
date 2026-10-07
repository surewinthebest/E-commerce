import AIAssistantModal from "@/src/components/AIAssistantModal";
import React, { useState, useCallback } from "react";
import { router, useFocusEffect } from 'expo-router'
import { View, StyleSheet } from "react-native";
import SafeScreen from "@/src/components/SafeScreen";
import { Color } from "@/src/models/Color";

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.Black
    }
});

const AIChatScreen = () => {
    const [showChatModal, setShowChatModal] = useState(true);

    // Reset modal state to true every time the tab gains focus
    useFocusEffect(
        useCallback(() => {
            setShowChatModal(true);
            return () => {
                setShowChatModal(false);
            };
        }, [])
    );

    const handleCloseModal = () => {
        setShowChatModal(false);
        router.back();
    };

    return (
        <View style={styles.screen}>
            <SafeScreen>
                <AIAssistantModal visible={showChatModal} onClose={handleCloseModal} />
            </SafeScreen>
        </View>
    )
};

export default React.memo(AIChatScreen);