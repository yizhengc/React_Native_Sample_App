import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NavItem } from '@/constants/types';

interface BottomNavProps {
  activeNav: NavItem;
  onTabChange: (tab: NavItem) => void;
}

type NavItemConfig = {
  id: NavItem;
  label: string;
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
};

const BottomNav: React.FC<BottomNavProps> = ({ activeNav, onTabChange }) => {
  const navItems: NavItemConfig[] = [
    { id: 'home', label: 'Home', iconName: 'home' },
    { id: 'timer', label: 'Timer', iconName: 'timer' },
    { id: 'analysis', label: 'Analysis', iconName: 'show-chart' },
    { id: 'profile', label: 'Profile', iconName: 'person' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ThemedView style={styles.navBar} lightColor="#FFFFFF" darkColor="#1C1C1E">
        <View style={styles.navContent}>
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => onTabChange(item.id)}
                style={styles.navButton}
              >
                <MaterialIcons
                  name={item.iconName}
                  size={24}
                  color={isActive ? '#3B82F6' : '#9CA3AF'}
                />
                <ThemedText
                  style={[
                    styles.navLabel,
                    isActive && styles.navLabelActive,
                  ]}
                >
                  {item.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  navBar: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    paddingHorizontal: 24,
    height: 88,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 16,
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  navLabelActive: {
    color: '#3B82F6',
  },
});

export default BottomNav;