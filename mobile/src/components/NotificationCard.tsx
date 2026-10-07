import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/AppText';
import { Color } from '@/src/models/Color';
import { Typography } from '@/src/models/Font';
import { Notification } from '@/src/types/index';

interface NotificationCardProps {
  item: Notification;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Color.ProfileGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color.Green + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    color: Color.White,
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    color: Color.Grey,
  },
  body: {
    color: Color.Grey,
    marginTop: 2,
    lineHeight: 18,
  },
  badge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: Color.Green + '30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: Color.Green,
  },
});

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const NotificationCard: React.FC<NotificationCardProps> = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="notifications" size={20} color={Color.Green} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <AppText style={styles.title} typography={Typography.textSmB} numberOfLines={1}>
            {item.title}
          </AppText>
          <AppText style={styles.dateText} typography={Typography.text2Xs}>
            {formatDate(item.createdAt)}
          </AppText>
        </View>

        <AppText style={styles.body} typography={Typography.textXs}>
          {item.body}
        </AppText>

        {item.targetType === 'ALL' && (
          <View style={styles.badge}>
            <AppText style={styles.badgeText} typography={Typography.text2XsB}>
              Announcement
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(NotificationCard);