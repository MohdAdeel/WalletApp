import React, { useState } from 'react';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomAlert, { AlertVariant } from '../../components/CustomAlert';

type SecureBackupParamList = AuthStackParamList & {
  Home: undefined;
};

type Props = NativeStackScreenProps<SecureBackupParamList, 'SecureBackup'>;

type AlertState = {
  visible: boolean;
  variant: AlertVariant;
  title: string;
  message: string;
};

const SecureBackup = ({ navigation }: Props) => {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    variant: 'success',
    title: '',
    message: '',
  });

  const showAlert = (variant: AlertVariant, title: string, message: string) => {
    setAlertState({ visible: true, variant, title, message });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, visible: false }));
  };

  const handleConfirm = () => {
    showAlert(
      'success',
      'Backup Confirmed',
      'Great! This would now move you to the main wallet stack.',
    );
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Protect Your Keys</Text>
      <Text style={styles.subtitle}>
        Store your Public Key, Private Key and Recovery Phrase in a safe-place.
      </Text>

      <View style={styles.checklist}>
        {[
          'Saved my public key',
          'Safely stored private key',
          'Backed up recovery phrase',
        ].map(item => (
          <View key={item} style={styles.checkItem}>
            <View style={styles.dot} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryText}>Need more time</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Yes, I have stored everything</Text>
      </TouchableOpacity>
      <CustomAlert
        visible={alertState.visible}
        variant={alertState.variant}
        title={alertState.title}
        message={alertState.message}
        onClose={hideAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#01020b',
    padding: 24,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    color: '#8a94b0',
    fontSize: 16,
    marginBottom: 24,
  },
  checklist: {
    marginBottom: 40,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00ffb3',
    marginRight: 12,
  },
  checkText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonSecondary: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3a4362',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryText: {
    color: '#8a94b0',
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: '#0f6bff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#0f6bff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonText: {
    color: '#fefefe',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SecureBackup;
