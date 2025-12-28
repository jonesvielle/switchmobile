import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
  BackHandler,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native';
import {
  Eye,
  EyeOff,
  Send,
  CreditCard,
  Download,
  ArrowRightCircle,
  Menu,
  Smile,
} from 'lucide-react-native';

import { RootState } from '../store';
import { getBankAccounts } from '../services/api';

const { width: screenWidth, height } = Dimensions.get('window');

const CARD_WIDTH = screenWidth * 0.82;
const CARD_MARGIN = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { firstName, avatar } = useSelector((state: RootState) => state.auth);

  const [accounts, setAccounts] = useState([]);
  const [showBalances, setShowBalances] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );

      navigation.setOptions({ gestureEnabled: false });

      return () => {
        backHandler.remove();
        navigation.setOptions({ gestureEnabled: true });
      };
    }, [navigation]),
  );

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBankAccounts();
      setAccounts(data || []);
    } catch (err) {
      console.log('Failed to load accounts', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAccounts();
  }, [fetchAccounts]);

  const renderAccountCard = (item, index) => (
    <View
      key={item.id || index}
      style={[
        styles.cardWrapper,
        index === 0 && styles.firstCard,
        index === accounts.length - 1 && styles.lastCard,
      ]}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>{item.type || 'Savings Account'}</Text>
          <TouchableOpacity onPress={() => setShowBalances(!showBalances)}>
            {showBalances ? (
              <Eye size={22} color="#ffffff" />
            ) : (
              <EyeOff size={22} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.cardBalance}>
          {showBalances
            ? `${item?.currency}${(item.balance || 0).toLocaleString()}`
            : '******'}
        </Text>

        <Text style={styles.cardNumber}>
          {item.accountNumber
            ? `${item.accountNumber.slice(
                0,
                4,
              )} **** **** ${item.accountNumber.slice(-4)}`
            : '**** **** **** ****'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Menu size={28} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.greeting}>
          Hi, {firstName?.split(' ')[0] || 'User'} <Smile size={20} />
        </Text>

        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>
                {firstName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00A859']}
            tintColor="#00A859"
            title="Refreshing accounts..."
            titleColor="#00A859"
          />
        }
      >
        <View style={styles.carouselSection}>
          <Text style={styles.sectionTitle}>Virtual Bank Accounts</Text>

          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00A859" />
              <Text style={styles.loadingText}>Loading your accounts...</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              pagingEnabled
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="center"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
              scrollEventThrottle={16}
            >
              {accounts.length > 0 ? (
                accounts.map(renderAccountCard)
              ) : (
                <View style={[styles.cardWrapper, styles.emptyCardWrapper]}>
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No accounts yet</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {[
              { icon: Send, label: 'Transfer', color: '#6366f1' },
              { icon: CreditCard, label: 'Cards', color: '#10b981' },
              { icon: Download, label: 'Bills', color: '#f59e0b' },
              { icon: ArrowRightCircle, label: 'More', color: '#8b5cf6' },
            ].map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionButton}>
                <action.icon size={28} color={action.color} />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.transactions}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.placeholderText}>
            No transactions yet, Start exploring!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: height * 0.05,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  avatarFallback: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  carouselSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  cardsContainer: {
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN / 2,
  },
  firstCard: {
    marginLeft: 0,
  },
  lastCard: {
    marginRight: CARD_MARGIN,
  },
  card: {
    backgroundColor: '#6366f1',
    borderRadius: 24,
    padding: 28,
    height: 220,
    justifyContent: 'space-between',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  cardBalance: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  cardNumber: {
    color: '#e0e7ff',
    fontSize: 18,
    letterSpacing: 2,
  },
  emptyCardWrapper: {
    width: CARD_WIDTH,
  },
  emptyCard: {
    backgroundColor: '#e2e8f0',
    borderRadius: 24,
    padding: 28,
    height: 220,
    justifyContent: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 18,
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  actionButton: {
    width: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
  },
  transactions: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 60,
  },
  placeholderText: {
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 40,
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  loadingText: {
    marginTop: 16,
    color: '#00A859',
    fontSize: 16,
  },
});

export default DashboardScreen;
