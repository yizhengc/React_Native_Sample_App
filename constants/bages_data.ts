import { BadgeItem } from "@/constants/types";

export const BADGES_DATA: BadgeItem[] = [
  {
    id: '1',
    title: 'Progress',
    count: 0,
    description: 'Complete project tasks on time',
    theme: 'purple',
    iconName: 'track-changes',
  },
  {
    id: '2',
    title: 'Good Day',
    count: 0,
    description: 'Complete all daily tasks',
    theme: 'green',
    iconName: 'check-circle',
  },
  {
    id: '3',
    title: 'Focus',
    count: 0,
    description: 'Complete pomodoro cycles',
    theme: 'yellow',
    iconName: 'bolt',
  },
];