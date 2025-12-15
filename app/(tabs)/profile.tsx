import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BadgeCard from '@/components/ui/BadgeCard';
import { BADGES_DATA } from '@/constants/bages_data';
import { TabView } from '@/constants/types';
import { useState } from 'react';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabView>('badges');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.content}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Profile</ThemedText>
            <ThemedText style={styles.subtitle}>Your achievements and projects</ThemedText>
          </View>

          {/* Toggle Switcher */}
          <View style={styles.toggleContainer}>
            <Pressable
              onPress={() => setActiveTab('badges')}
              style={[
                styles.toggleButton,
                activeTab === 'badges' && styles.toggleButtonActive,
              ]}
            >
              <MaterialIcons 
                name="emoji-events" 
                size={18} 
                color={activeTab === 'badges' ? '#000000' : '#6B7280'} 
              />
              <ThemedText 
                style={[
                  styles.toggleButtonText,
                  activeTab === 'badges' && styles.toggleButtonTextActive,
                ]}
              >
                Badges
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('projects')}
              style={[
                styles.toggleButton,
                activeTab === 'projects' && styles.toggleButtonActive,
              ]}
            >
              <MaterialIcons 
                name="folder-open" 
                size={18} 
                color={activeTab === 'projects' ? '#000000' : '#6B7280'} 
              />
              <ThemedText 
                style={[
                  styles.toggleButtonText,
                  activeTab === 'projects' && styles.toggleButtonTextActive,
                ]}
              >
                Projects
              </ThemedText>
            </Pressable>
          </View>

          {/* Content Views */}
          {activeTab === 'badges' ? (
            <View style={styles.badgesContainer}>
              {BADGES_DATA.map((badge) => (
                <BadgeCard key={badge.id} item={badge} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="folder-open" size={48} color="#9CA3AF" style={styles.emptyIcon} />
              <ThemedText style={styles.emptyText}>No active projects</ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  toggleContainer: {
    backgroundColor: '#F3F4F6',
    padding: 4,
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  toggleButtonActive: {
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
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#000000',
  },
  badgesContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  emptyContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 256,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.2,
  },
  emptyText: {
    color: '#9CA3AF',
  },
});