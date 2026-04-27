import {
  View,
  Text,
  Modal,
  Easing,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

const ALERT_CONFIG: Record<
  AlertVariant,
  {
    accent: string;
    gradientStart: string;
    gradientEnd: string;
    glowColor: string;
    icon: string;
    header: string;
  }
> = {
  success: {
    accent: '#00E000',
    gradientStart: 'rgba(0, 224, 0, 0.25)',
    gradientEnd: 'rgba(0, 224, 0, 0.05)',
    glowColor: 'rgba(0, 224, 0, 0.2)',
    icon: 'shield-check',
    header: 'SUCCESS',
  },
  warning: {
    accent: '#F7931A',
    gradientStart: 'rgba(247, 147, 26, 0.25)',
    gradientEnd: 'rgba(247, 147, 26, 0.05)',
    glowColor: 'rgba(247, 147, 26, 0.2)',
    icon: 'alert',
    header: 'WARNING',
  },
  error: {
    accent: '#FF3B30',
    gradientStart: 'rgba(255, 59, 48, 0.25)',
    gradientEnd: 'rgba(255, 59, 48, 0.05)',
    glowColor: 'rgba(255, 59, 48, 0.2)',
    icon: 'alert-circle',
    header: 'ERROR',
  },
  info: {
    accent: '#63FFFF',
    gradientStart: 'rgba(99, 255, 255, 0.25)',
    gradientEnd: 'rgba(99, 255, 255, 0.05)',
    glowColor: 'rgba(99, 255, 255, 0.2)',
    icon: 'information',
    header: 'NOTICE',
  },
};

type CustomAlertProps = {
  visible: boolean;
  variant: AlertVariant;
  title: string;
  message: string;
  onClose: () => void;
  buttonLabel?: string;
};

const CustomAlert = ({
  visible,
  variant,
  title,
  message,
  onClose,
  buttonLabel = 'GOT IT',
}: CustomAlertProps) => {
  const [rendered, setRendered] = useState(visible);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const scale = useRef(new Animated.Value(0.98)).current;
  const config = useMemo(() => ALERT_CONFIG[variant], [variant]);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
      return;
    }

    if (rendered) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
        Animated.timing(translateY, {
          toValue: 18,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
        Animated.timing(scale, {
          toValue: 0.97,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setRendered(false);
        }
      });
    }
  }, [visible, rendered, opacity, translateY, scale]);

  if (!rendered) {
    return null;
  }

  return (
    <Modal transparent visible={rendered} animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.card,
            {
              shadowColor: config.accent,
              transform: [{ translateY }, { scale }],
              opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[config.gradientStart, config.gradientEnd, 'transparent']}
            style={styles.glow}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <View style={styles.headerRow}>
            <View
              style={[
                styles.iconWrap,
                {
                  borderColor: config.accent,
                  backgroundColor: config.glowColor,
                  shadowColor: config.accent,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={config.icon}
                size={28}
                color={config.accent}
              />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.badge, { color: config.accent }]}>
                {config.header}
              </Text>
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: config.accent,
                backgroundColor: config.glowColor,
                shadowColor: config.accent,
              },
            ]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: config.accent }]}>
              {buttonLabel}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 8, 15, 0.85)',
  },
  card: {
    width: '88%',
    backgroundColor: 'rgba(17, 18, 28, 0.95)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 32,
    elevation: 20,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  headerText: {
    flex: 1,
  },
  badge: {
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  message: {
    color: '#93A6C1',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 22,
    letterSpacing: 0.3,
  },
  button: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    fontSize: 13,
    letterSpacing: 3,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

export default CustomAlert;
