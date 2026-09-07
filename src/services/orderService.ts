import rawOrders from '../data/orders.json';
import { Order, OrderStatus, TrackingStep } from '../types/order';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vaunt_orders_v1';

function generateTrackingSteps(status: OrderStatus, createdAtStr: string): TrackingStep[] {
  const baseDate = new Date(createdAtStr);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const d0 = formatDate(baseDate);
  const d1 = formatDate(new Date(baseDate.getTime() + 1000 * 60 * 45)); // +45m
  const d2 = formatDate(new Date(baseDate.getTime() + 1000 * 60 * 60 * 4)); // +4h
  const d3 = formatDate(new Date(baseDate.getTime() + 1000 * 60 * 60 * 20)); // +20h
  const d4 = formatDate(new Date(baseDate.getTime() + 1000 * 60 * 60 * 48)); // +2d
  const d5 = formatDate(new Date(baseDate.getTime() + 1000 * 60 * 60 * 56)); // +2d 8h

  const stages: { status: OrderStatus; title: string; desc: string; date: string }[] = [
    { status: 'Order Placed', title: 'Order Placed & Verified', desc: 'Payment received successfully', date: d0 },
    { status: 'Confirmed', title: 'Confirmed by VAUNT Studio', desc: 'Allocated at Central Fulfilment Hub', date: d1 },
    { status: 'Packed', title: 'Packed in Eco-Luxe Box', desc: 'Tamper-proof seal applied', date: d2 },
    { status: 'Shipped', title: 'Shipped via Express Courier', desc: 'Tracking AWB generated', date: d3 },
    { status: 'Out for Delivery', title: 'Out for Delivery', desc: 'Delivery partner is en route', date: d4 },
    { status: 'Delivered', title: 'Delivered', desc: 'Package handed over with OTP verification', date: d5 },
  ];

  if (status === 'Cancelled') {
    return [
      {
        status: 'Order Placed',
        title: 'Order Placed',
        description: 'Order was submitted',
        timestamp: d0,
        completed: true,
        isCurrent: false,
      },
      {
        status: 'Cancelled',
        title: 'Order Cancelled',
        description: 'Refund initiated to original payment source (3-5 business days)',
        timestamp: formatDate(new Date()),
        completed: true,
        isCurrent: true,
      },
    ];
  }

  const statusOrder: OrderStatus[] = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentIndex = statusOrder.indexOf(status);

  return stages.map((stage, idx) => {
    const isCompleted = idx <= currentIndex;
    const isCurrent = idx === currentIndex;
    return {
      status: stage.status,
      title: stage.title,
      description: stage.desc,
      timestamp: isCompleted ? stage.date : 'Pending',
      completed: isCompleted,
      isCurrent: isCurrent,
    };
  });
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load orders from storage', e);
    }
    return [...(rawOrders as Order[])];
  },

  async saveOrders(orders: Order[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to storage', e);
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    const found = orders.find((o) => o.id === id);
    return found ? { ...found } : null;
  },

  async createOrder(
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingSteps' | 'canCancel' | 'status'>
  ): Promise<Order> {
    const orders = await this.getOrders();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ord_vnt_${randomNum}`;
    const orderNumber = `VNT-${randomNum}-${new Date().getFullYear()}`;
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber,
      createdAt,
      status: 'Order Placed',
      canCancel: true,
      trackingSteps: generateTrackingSteps('Order Placed', createdAt),
    };

    orders.unshift(newOrder);
    await this.saveOrders(orders);
    return newOrder;
  },

  async cancelOrder(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    const target = orders.find((o) => o.id === orderId);
    if (!target) return null;

    target.status = 'Cancelled';
    target.canCancel = false;
    target.paymentStatus = target.paymentStatus === 'Paid' ? 'Refunded' : 'Pending';
    target.trackingSteps = generateTrackingSteps('Cancelled', target.createdAt);

    await this.saveOrders(orders);
    return target;
  },
};
