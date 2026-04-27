import {
  Text,
  View,
  Image,
  Switch,
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/color';
import React, { useMemo, useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import CompleteProfileCard from '../../components/CompleteProfileCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const themes = [
  {
    id: 'cyber',
    name: 'Cyber',
    subtitle: 'Neon aqua border',
    swatch: Colors.accentPrimary,
    cardColor: Colors.surfaceAccent,
  },
  {
    id: 'neon',
    name: 'Neon',
    subtitle: 'Colorful dusk glow',
    swatch: Colors.accentPurple,
    cardColor: Colors.surfaceBase,
  },
  {
    id: 'dark',
    name: 'Dark',
    subtitle: 'Midnight matte',
    swatch: Colors.backgroundBase,
    cardColor: Colors.backgroundAlt,
  },
];

const SettingsScreen = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState(themes[0].id);
  const navigation = useNavigation<any>();
  const { walletPublicKey, clearWalletCredentials } = useAuth();
  const selectedTheme = useMemo(
    () => themes.find(theme => theme.id === selectedThemeId) ?? themes[0],
    [selectedThemeId],
  );

  const profileAddressText = walletPublicKey ?? 'Wallet address not available';
  const profileAddressShort = walletPublicKey
    ? `${walletPublicKey.slice(0, 8)}...${walletPublicKey.slice(-6)}`
    : profileAddressText;

  const handleCopyAddress = () => {
    if (!walletPublicKey) {
      Alert.alert('Unavailable', 'Wallet public address is not available yet.');
      return;
    }
    Clipboard.setString(walletPublicKey);
    Alert.alert('Copied', 'Wallet public address copied to clipboard.');
  };

  const handleCompleteProfile = () => {
    navigation.navigate('CreateProfile');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out Warning',
      "Don't do this unless you are sure. It will log you out and require wallet setup/import again.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await clearWalletCredentials();
            navigation.getParent()?.getParent()?.navigate('AppFlow');
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.backgroundBase }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.darkBackground}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={[styles.scrollContainer, { backgroundColor: Colors.backgroundBase }]}
      >
        <View style={styles.headerBar}>
          <Pressable
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.iconText, { color: selectedTheme.swatch }]}>
              {'\u2190'}
            </Text>
          </Pressable>
          <Text style={styles.headerTitle}>Security &amp; Settings</Text>
          <Pressable
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={handleLogout}
          >
            <Text style={[styles.iconText, styles.powerIcon]}>⏻</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.profileCard,
            {
              borderColor: `${selectedTheme.swatch}55`,
              backgroundColor: selectedTheme.cardColor,
            },
          ]}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAAyOfNUkwo0o9How-NfIh4c84GRmulFKn9QHXDu_ORLpm0d1Eg-ZH9TNavlNHVPxmRRjLKh0WyP102fzsOrBQ1vZ8oRD0sUcoQf0i0w&s=10',
              }}
              style={styles.avatar}
            />
            <View style={styles.avatarBorder} />
          </View>
          <View style={styles.profileNameRow}>
            <Text style={styles.profileName}>{profileAddressShort}</Text>
            <Pressable
              style={styles.copyAddressButton}
              onPress={handleCopyAddress}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={14}
                color={Colors.accentBlue}
              />
            </Pressable>
          </View>

          <View style={styles.badges}>
            {/* <View style={styles.badge}>
              <Text style={styles.badgeText}>{profileAddressText}</Text>
            </View> */}
            <View style={[styles.badge, styles.purpleBadge]}>
              <Text style={styles.badgeText}>Public Wallet</Text>
            </View>
          </View>
        </View>
        <View style={styles.profileCompletionWrap}>
          <CompleteProfileCard onPress={handleCompleteProfile} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Shield</Text>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Biometric Login</Text>
              <Text style={styles.settingDetail}>Face ID or Touch ID</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: Colors.borderSubtle, true: selectedTheme.swatch }}
              thumbColor={biometricEnabled ? Colors.backgroundBase : Colors.textPrimary}
            />
          </View>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Two-Factor Auth</Text>
              <Text style={styles.settingDetail}>Google Authenticator</Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: Colors.borderSubtle, true: selectedTheme.swatch }}
              thumbColor={twoFactorEnabled ? Colors.backgroundBase : Colors.textPrimary}
            />
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Passcode Lock</Text>
              <Text style={styles.settingDetail}>6-digit secure pin</Text>
            </View>
            <Text style={styles.settingDetail}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visual Core</Text>
          <View style={styles.themeRow}>
            {themes.map((theme, index) => {
              const isLast = index === themes.length - 1;
              return (
                <Pressable
                  key={theme.id}
                  style={[
                    styles.themeCard,
                    selectedThemeId === theme.id && styles.themeCardActive,
                    isLast && styles.themeCardLast,
                    selectedThemeId === theme.id && {
                      borderColor: selectedTheme.swatch,
                    },
                  ]}
                  onPress={() => setSelectedThemeId(theme.id)}
                >
                  <View
                    style={[
                      styles.themeSwatch,
                      { backgroundColor: theme.swatch },
                    ]}
                  />
                  <Text style={styles.themeName}>{theme.name}</Text>
                  <Text style={styles.themeSubtitle}>{theme.subtitle}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.supportCard}>
            <View>
              <Text style={styles.supportTitle}>24/7 Concierge Support</Text>
              <Text style={styles.supportDetail}>
                Priority help for pro members
              </Text>
            </View>
            <Pressable style={styles.chatButton}>
              <Text style={styles.chatButtonText}>CHAT</Text>
            </Pressable>
          </View>
        </View>
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
    paddingBottom: 48,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundBase,
  },
  iconText: {
    color: Colors.whiteText,
    fontSize: 18,
  },
  powerIcon: {
    fontSize: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.whiteText,
    fontSize: 17,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 6,
  },
  imageWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: Colors.accentBlue,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarBorder: {
    position: 'absolute',
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 2,
    borderColor: Colors.glowCyanMid,
  },
  profileName: {
    color: Colors.whiteText,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 0,
  },
  copyAddressButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accentBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  profileSubheading: {
    color: Colors.accentBlue,
    marginTop: 4,
    fontSize: 12,
    letterSpacing: 1,
  },
  badges: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  profileCompletionWrap: {
    marginBottom: 22,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: Colors.surfaceElevated,
  },
  purpleBadge: {
    backgroundColor: Colors.accentPurple,
  },
  badgeText: {
    color: Colors.whiteText,
    fontSize: 11,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.lightGreyText,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    marginBottom: 10,
  },
  settingItem: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  settingLabel: {
    color: Colors.whiteText,
    fontSize: 16,
    fontWeight: '600',
  },
  settingDetail: {
    color: Colors.lightGreyText,
    fontSize: 12,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: Colors.backgroundBase,
    padding: 16,
    marginRight: 12,
  },
  themeCardLast: {
    marginRight: 0,
  },
  themeCardActive: {
    borderColor: Colors.accentBlue,
    borderWidth: 2,
    shadowColor: Colors.accentBlue,
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  themeSwatch: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    marginBottom: 10,
  },
  themeName: {
    color: Colors.whiteText,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeSubtitle: {
    color: Colors.lightGreyText,
    fontSize: 12,
  },
  supportCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supportTitle: {
    color: Colors.whiteText,
    fontSize: 16,
    fontWeight: '600',
  },
  supportDetail: {
    color: Colors.lightGreyText,
    fontSize: 12,
    marginTop: 4,
  },
  chatButton: {
    backgroundColor: Colors.accentBlue,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  chatButtonText: {
    color: Colors.darkBackground,
    fontWeight: '700',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.backgroundAlt,
    marginBottom: 6,
  },
  navLabel: {
    color: Colors.lightGreyText,
    fontSize: 10,
  },
});

export default SettingsScreen;
