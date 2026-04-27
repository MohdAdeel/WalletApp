import {
  View,
  Text,
  Platform,
  Pressable,
  StatusBar,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../constants/color';
import { useNavigation } from '@react-navigation/native';

const CreateProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');

  const handleSaveProfile = () => {
    const profileDetails = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      bio: bio.trim(),
    };

    console.log('Profile details saved:', profileDetails);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.darkBackground}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>{'\u2190'}</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Create Profile</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Set up your profile</Text>
            <Text style={styles.heroSubtitle}>
              Add a few details to personalize your wallet experience.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#7D8798"
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#7D8798"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#7D8798"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Text style={styles.label}>Country</Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="Enter your country"
              placeholderTextColor="#7D8798"
              style={styles.input}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us a little about yourself"
              placeholderTextColor="#7D8798"
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.bioInput]}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0E0E12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  backText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2A4368',
    backgroundColor: '#101C2B',
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
  formCard: {
    borderRadius: 18,
    backgroundColor: '#111823',
    borderWidth: 1,
    borderColor: '#233349',
    padding: 16,
  },
  label: {
    color: Colors.whiteText,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#1B2534',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3D53',
    color: Colors.whiteText,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  bioInput: {
    minHeight: 100,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0B0D13',
    borderTopWidth: 1,
    borderTopColor: '#1C283A',
  },
  saveButton: {
    backgroundColor: Colors.accentBlue,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: Colors.darkBackground,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default CreateProfileScreen;
