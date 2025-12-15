import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

export type ColorTheme = 'purple' | 'green' | 'yellow' | 'blue';

export interface BadgeItem {
  id: string;
  title: string;
  count: number;
  description: string;
  theme: ColorTheme;
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
}

export type TabView = 'badges' | 'projects';

export type NavItem = 'home' | 'timer' | 'analysis' | 'profile';