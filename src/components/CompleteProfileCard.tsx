import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/color';

type CompleteProfileCardProps = {
  onPress: () => void;
};

const CompleteProfileCard = ({ onPress }: CompleteProfileCardProps) => {
  return (
    <View style={styles.completeProfileCard}>
      <View style={styles.completeProfileHeader}>
        <View style={styles.completeProfileIconWrap}>
          <MaterialCommunityIcons
            name="account-check-outline"
            size={16}
            color={Colors.accentBlue}
          />
        </View>
        <Text style={styles.completeProfileTitle}>Complete Your Profile</Text>
      </View>
      <Text style={styles.completeProfileText}>
        Add your profile details to unlock a personalized wallet experience.
      </Text>
      <Pressable style={styles.completeProfileButton} onPress={onPress}>
        <Text style={styles.completeProfileButtonText}>Get Started</Text>
        <MaterialCommunityIcons
          name="arrow-right"
          size={14}
          color={Colors.darkBackground}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  completeProfileCard: {
    width: '100%',
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A4368',
    backgroundColor: '#101C2B',
    padding: 14,
  },
  completeProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  completeProfileIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#182B44',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  completeProfileTitle: {
    color: Colors.whiteText,
    fontSize: 14,
    fontWeight: '700',
  },
  completeProfileText: {
    color: Colors.lightGreyText,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  completeProfileButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentBlue,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  completeProfileButtonText: {
    color: Colors.darkBackground,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CompleteProfileCard;
