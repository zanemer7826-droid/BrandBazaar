import { Order } from '../types/ecommerce';

export interface EmailNotificationResult {
  success: boolean;
  recipient: string;
  subject: string;
  timestamp: string;
  messageId: string;
}

export const sendOrderConfirmationEmail = async (order: Order): Promise<EmailNotificationResult> => {
  const recipient = order.customer.email || 'customer@example.com';
  const subject = `Order Confirmation #${order.id} - Brand Bazaar`;
  const messageId = `msg-${Math.random().toString(36).substring(2, 11)}`;
  
  const emailPayload = {
    to: recipient,
    subject,
    orderId: order.id,
    total: order.total,
    itemsCount: order.items.length,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    shippingAddress: order.customer,
    timestamp: new Date().toISOString(),
  };

  // Dispatch email to Express Node.js backend email handler (SendGrid or server mailer)
  try {
    const res = await fetch('/api/send-order-confirmation-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    const result = await res.json();
    console.log('[Node.js Express Email Backend Response]:', result);
  } catch (err) {
    console.warn('[Node.js Express Email Backend Error]:', err);
  }

  // Store in localStorage outbox
  try {
    const existingOutbox = JSON.parse(localStorage.getItem('bb_email_outbox') || '[]');
    localStorage.setItem('bb_email_outbox', JSON.stringify([{ messageId, ...emailPayload }, ...existingOutbox]));
  } catch {}

  return {
    success: true,
    recipient,
    subject,
    timestamp: new Date().toISOString(),
    messageId,
  };
};
