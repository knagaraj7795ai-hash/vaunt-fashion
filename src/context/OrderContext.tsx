import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, PaymentMethod } from '../types/order';
import { CartItem } from '../types/cart';
import { Address } from '../types/address';
import { orderService } from '../services/orderService';

interface PlaceOrderParams {
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  deliverySpeed: 'Standard' | 'Express';
  summary: {
    mrpTotal: number;
    discountTotal: number;
    couponDiscount: number;
    couponCode?: string;
    deliveryFee: number;
    platformFee: number;
    totalAmount: number;
  };
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (params: PlaceOrderParams) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  refreshOrders: () => Promise<void>;
  activeOrdersCount: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrders = async () => {
    const list = await orderService.getOrders();
    setOrders(list);
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const placeOrder = async (params: PlaceOrderParams): Promise<Order> => {
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + (params.deliverySpeed === 'Express' ? 2 : 4));
    const estimatedStr = estimatedDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    const newOrder = await orderService.createOrder({
      items: params.items,
      shippingAddress: params.shippingAddress,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      deliverySpeed: params.deliverySpeed,
      estimatedDelivery: estimatedStr,
      summary: params.summary,
    });

    await refreshOrders();
    return newOrder;
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    const res = await orderService.cancelOrder(orderId);
    if (res) {
      await refreshOrders();
      return true;
    }
    return false;
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    const memoryFound = orders.find((o) => o.id === orderId);
    if (memoryFound) return memoryFound;
    return await orderService.getOrderById(orderId);
  };

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Returned'
  ).length;

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        cancelOrder,
        getOrderById,
        refreshOrders,
        activeOrdersCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
