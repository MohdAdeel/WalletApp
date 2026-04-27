import {
  Modal,
  View,
  Text,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../constants/color';
import HomeScreen from '../pages/Home/Home';
import MarketScreen from '../pages/Market/Market';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsScreen from '../pages/Settings/Settings';
import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TransactionHistoryScreen from '../pages/TransactionHistory/TransactionHistory';

const Tab = createBottomTabNavigator();

// Custom tab bar component to match the design
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // Filter out the Add route and get only the actual tabs
  const tabs = state.routes.filter((route: any) => route.name !== 'Add');

  // Get the first two tabs (Home, Market)
  const leftTabs = tabs.slice(0, 2);
  // Get the last two tabs (History, Settings)
  const rightTabs = tabs.slice(2, 4);

  const handleQuickAction = (target: 'Send' | 'Receive') => {
    setIsQuickActionOpen(false);
    navigation.getParent()?.navigate(target);
  };

  const renderTab = (route: any, index: number, originalIndex: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === originalIndex;
    const routeName = route.name;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    };

    // Icon mapping - using Ionicons from react-native-vector-icons
    const getIconName = () => {
      switch (routeName) {
        case 'Home':
          return isFocused ? 'home' : 'home-outline';
        case 'Market':
          return isFocused ? 'stats-chart' : 'stats-chart-outline';
        case 'History':
          return isFocused ? 'time' : 'time-outline';
        case 'Settings':
          return isFocused ? 'settings' : 'settings-outline';
        default:
          return 'ellipse-outline';
      }
    };

    const iconName = getIconName();
    const label = routeName.toUpperCase();

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        style={styles.tabItem}
        activeOpacity={0.85}
      >
        <View style={[styles.tabInner, isFocused && styles.tabInnerFocused]}>
          <Icon
            name={iconName}
            size={22}
            style={[
              styles.tabIcon,
              {
                color: isFocused ? Colors.accentBlue : Colors.inactiveTabColor,
              },
            ]}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: isFocused ? Colors.whiteText : Colors.inactiveTabColor },
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.tabBarContainer}>
        {/* Left side tabs */}
        <View style={styles.tabsLeft}>
          {leftTabs.map((route: any, index: number) =>
            renderTab(route, index, state.routes.indexOf(route)),
          )}
        </View>

        {/* Central Action Button */}
        <View style={styles.centralButtonWrapper}>
          <TouchableOpacity
            style={styles.centralButton}
            onPress={() => setIsQuickActionOpen(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.gradientPurpleEnd, Colors.gradientBlueStart]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.centralButtonGradient}
            >
              <Icon name="add" size={36} color={Colors.whiteText} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Right side tabs */}
        <View style={styles.tabsRight}>
          {rightTabs.map((route: any, index: number) =>
            renderTab(route, index + 2, state.routes.indexOf(route)),
          )}
        </View>
      </View>

      <Modal
        visible={isQuickActionOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsQuickActionOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsQuickActionOpen(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Quick Actions</Text>
            <Text style={styles.modalSubtitle}>
              Choose what you want to do next
            </Text>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={() => handleQuickAction('Send')}
              activeOpacity={0.85}
            >
              <View style={styles.modalActionIconWrap}>
                <Icon
                  name="arrow-up-outline"
                  size={18}
                  color={Colors.whiteText}
                />
              </View>
              <Text style={styles.modalActionText}>Send</Text>
              <Icon
                name="chevron-forward"
                size={18}
                color={Colors.inactiveTabColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={() => handleQuickAction('Receive')}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.modalActionIconWrap,
                  styles.modalActionIconWrapReceive,
                ]}
              >
                <Icon
                  name="arrow-down-outline"
                  size={18}
                  color={Colors.whiteText}
                />
              </View>
              <Text style={styles.modalActionText}>Receive</Text>
              <Icon
                name="chevron-forward"
                size={18}
                color={Colors.inactiveTabColor}
              />
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Market" component={MarketScreen} />
      <Tab.Screen
        name="Add"
        component={() => null}
        listeners={{
          tabPress: e => {
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen name="History" component={TransactionHistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 92 : 76,
    backgroundColor: '#0E1118',
    borderTopWidth: 1,
    borderTopColor: '#1F2632',
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    paddingTop: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    shadowColor: '#000814',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  tabsLeft: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 38,
  },
  tabsRight: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 38,
    paddingRight: 6,
  },
  tabItem: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tabInnerFocused: {
    backgroundColor: '#1B2331',
    borderWidth: 1,
    borderColor: '#2A3A56',
  },
  tabIcon: {
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  centralButtonWrapper: {
    position: 'absolute',
    left: '50%',
    marginLeft: -32,
    bottom: Platform.OS === 'ios' ? 30 : 34,
    zIndex: 10,
  },
  centralButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#DCE7FF',
    shadowColor: Colors.accentBlue,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 12,
  },
  centralButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.72)',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 48 : 30,
  },
  modalCard: {
    borderRadius: 24,
    backgroundColor: '#0F1624',
    borderWidth: 1,
    borderColor: '#2B3954',
    padding: 18,
    shadowColor: '#000814',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 14,
  },
  modalTitle: {
    color: Colors.whiteText,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: Colors.lightGreyText,
    fontSize: 12,
    marginBottom: 14,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121F34',
    borderWidth: 1,
    borderColor: '#2C4165',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
  },
  modalActionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2F4B84',
    marginRight: 10,
  },
  modalActionIconWrapReceive: {
    backgroundColor: '#1E5F4D',
  },
  modalActionText: {
    flex: 1,
    color: Colors.whiteText,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default BottomTabNavigator;
