import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import ProfileHeader from '@/src/components/ProfileHeader';
import { Typography } from '@/src/models/Font';
import { Color } from '@/src/models/Color';
import AppText from '@/src/components/AppText';
import usePushNotification from '@/src/hooks/usePushNotification';
import { Notification } from '@/src/types/index';
import NotificationCard from '@/src/components/NotificationCard';
import { NotificationSkeleton } from '@/src/components/LoadingSkeletonView';

const styles = StyleSheet.create({
  extraText: {
    color: Color.White,
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: Color.Grey,
    marginTop: 10,
  },
  errorText: {
    color: Color.Red || '#FF4D4D',
  },
});

const NotificationScreen = () => {
  const { notifications, isLoadingNoti, isErrorNoti } = usePushNotification();

  // Safely extract notification list depending on backend payload structure
  const notificationList: Notification[] = Array.isArray(notifications)
    ? notifications
    : (notifications as any)?.notifications || (notifications as any)?.notification || [];

  const itemUnit = notificationList.length > 1 ? 'notifications' : 'notification';

  const renderItem = useCallback<ListRenderItem<Notification>>(({ item }) => {
    return <NotificationCard item={item} />;
  }, []);

  return (
    <ProfileHeader
      screenTitle={'Notifications'}
      extraText={
        <AppText style={styles.extraText} typography={Typography.textBase}>
          {notificationList.length} {itemUnit}
        </AppText>
      }
    >
      {isErrorNoti ? (
        <View style={styles.centerContainer}>
          <AppText style={styles.errorText} typography={Typography.textSm}>
            Failed to load notifications
          </AppText>
        </View>
      ) : (
        <FlatList
          keyExtractor={(item) => item._id}
          data={notificationList}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            isLoadingNoti ? <NotificationSkeleton /> : <View style={styles.centerContainer}>
              <AppText style={styles.emptyText} typography={Typography.textSm}>
                No notifications yet
              </AppText>
            </View>
          }
        />
      )}
    </ProfileHeader>
  );
};

export default React.memo(NotificationScreen);