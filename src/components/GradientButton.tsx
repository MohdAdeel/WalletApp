import {
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Colors } from '../constants/color';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  showIcon?: boolean;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  colors?: string[];
  activeOpacity?: number;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  showIcon = true,
  iconName = 'chevron-right',
  iconSize = 20,
  iconColor = '#FFFFFF',
  containerStyle,
  buttonStyle,
  textStyle,
  colors = [Colors.gradientBlueStart, Colors.gradientPurpleEnd],
  activeOpacity = 0.8,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[styles.buttonWrapper, containerStyle]}
      onPress={onPress}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.button, buttonStyle]}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        {showIcon && (
          <Feather name={iconName} size={iconSize} color={iconColor} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 20,
    width: '100%',
    height: 60,
    borderRadius: 15,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    flex: 1,
    borderRadius: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 3,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GradientButton;
