import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SwapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Swap</Text>
      <Text style={styles.subheading}>
        Quickly exchange assets within the wallet.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f3ff',
    borderRadius: 12,
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
  },
  subheading: {
    marginTop: 4,
    color: '#3d2c94',
  },
});

export default SwapScreen;
