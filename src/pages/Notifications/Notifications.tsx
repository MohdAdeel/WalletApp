import {
  Text,
  View,
  StatusBar,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import { Colors } from '../../constants/color';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  iconBg: string;
};

const dummyNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Swap completed',
    description: 'Your ETH to USDC swap has been completed successfully.',
    time: '2 min ago',
    icon: 'swap-horizontal',
    iconBg: '#1E3A66',
  },
  {
    id: '2',
    title: 'Security alert',
    description: 'New login detected from an Android device.',
    time: '1 hr ago',
    icon: 'shield-check-outline',
    iconBg: '#244E3B',
  },
  {
    id: '3',
    title: 'Price movement',
    description: 'BTC moved +3.4% in the last 24 hours.',
    time: '3 hr ago',
    icon: 'trending-up',
    iconBg: '#4A2F13',
  },
  {
    id: '4',
    title: 'Backup reminder',
    description: 'Secure your wallet by backing up recovery phrase.',
    time: 'Yesterday',
    icon: 'bell-ring-outline',
    iconBg: '#3D2A5F',
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.darkBackground}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBar}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.iconText}>{'\u2190'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Stay Updated</Text>
          <Text style={styles.heroSubtitle}>
            Track wallet activity, market changes, and security alerts in one
            place.
          </Text>
        </View>

        {dummyNotifications.map(item => (
          <View key={item.id} style={styles.notificationCard}>
            <View
              style={[
                styles.notificationIconWrap,
                { backgroundColor: item.iconBg },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={18}
                color={Colors.whiteText}
              />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationDescription}>
                {item.description}
              </Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  scrollContainer: {
    backgroundColor: Colors.darkBackground,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E0E12',
  },
  iconButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  iconText: {
    color: Colors.whiteText,
    fontSize: 18,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#101C2B',
    borderWidth: 1,
    borderColor: '#2A4368',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  heroTitle: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: Colors.lightGreyText,
    fontSize: 13,
    lineHeight: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#121822',
    borderWidth: 1,
    borderColor: '#233349',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  notificationIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: Colors.whiteText,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  notificationDescription: {
    color: Colors.lightGreyText,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    color: Colors.accentBlue,
    fontSize: 11,
    fontWeight: '600',
  },
});

export default NotificationsScreen;
