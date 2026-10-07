import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNetwork } from '@/src/context/NetworkContext';

export function NetworkStatusBanner() {
  const { isOffline, isServerDown, setIsServerDown } = useNetwork();

  if (isOffline) {
    return (
      <View style={[styles.banner, styles.offlineBanner]}>
        <Text style={styles.text}>Please check your internet connectivity.</Text>
      </View>
    );
  }

  if (isServerDown) {
    return (
      <View style={[styles.banner, styles.serverBanner]}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Thank you for your support!</Text>
          <Text style={styles.subText}>
            Sorry, we are currently handling a high volume of visitors / network is unstable, please come back and try again later!
          </Text>
        </View>
        <Pressable onPress={() => setIsServerDown(false)} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
  },
  offlineBanner: { backgroundColor: '#323232' },
  serverBanner: { backgroundColor: '#D32F2F' },
  textContainer: { flex: 1, marginRight: 8 },
  text: { color: '#FFF', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  titleText: { color: '#FFF', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  subText: { color: '#FFF', fontSize: 12, lineHeight: 16 },
  closeButton: { padding: 4 },
  closeText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});