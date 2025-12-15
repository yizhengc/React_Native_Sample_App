import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BadgeItem } from '@/constants/types';

interface BadgeCardProps {
  item: BadgeItem;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ item }) => {
  const { title, count, description, theme, iconName } = item;

  // Dynamic style mapping based on the visual design
  const themeStyles = {
    purple: {
      borderColor: '#E9D5FF',
      iconBackground: '#E9D5FF',
      iconColor: '#9333EA',
      titleColor: '#A855F7',
      descColor: '#C084FC',
    },
    green: {
      borderColor: '#BBF7D0',
      iconBackground: '#BBF7D0',
      iconColor: '#16A34A',
      titleColor: '#22C55E',
      descColor: '#86EFAC',
    },
    yellow: {
      borderColor: '#FDE68A',
      iconBackground: '#FDE68A',
      iconColor: '#D97706',
      titleColor: '#FBBF24',
      descColor: '#FCD34D',
    },
    blue: {
      borderColor: '#BFDBFE',
      iconBackground: '#BFDBFE',
      iconColor: '#2563EB',
      titleColor: '#3B82F6',
      descColor: '#93C5FD',
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderColor: currentTheme.borderColor },
        pressed && styles.cardPressed,
      ]}
    >
      <ThemedView style={styles.cardContent} lightColor="#FFFFFF" darkColor="#1C1C1E">
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: currentTheme.iconBackground }]}>
              <MaterialIcons
                name={iconName}
                size={24}
                color={currentTheme.iconColor}
              />
            </View>
            <ThemedText style={[styles.title, { color: currentTheme.titleColor }]}>
              {title}
            </ThemedText>
          </View>
          
          <View style={styles.countContainer}>
            <ThemedText style={styles.countText}>{count}</ThemedText>
          </View>
        </View>

        <ThemedText style={[styles.description, { color: currentTheme.descColor }]}>
          {description}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    padding: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  countContainer: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BadgeCard;