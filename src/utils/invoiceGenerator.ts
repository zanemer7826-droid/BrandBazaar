import { Order, StoreBrandingSettings } from '../types/ecommerce';
import { formatRupees } from './currency';

export const generateInvoiceHtml = (order: Order, branding?: StoreBrandingSettings): string => {
  const storeName = branding?.storeName || 'BRAND BAZAAR';
  const primaryColor = branding?.primaryColor || '#4f46e5';
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const subtotal = order.subtotal || order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = order.tax || Math.round(subtotal * 0.05);
  const cgst = Math.round(tax / 2);
  const sgst = tax - cgst;
  const shipping = order.shipping || 0;
  const total = order.total || subtotal + tax + shipping;

  const itemsRows = order.items
    .map(
      (item, idx) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b;">${idx + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
        <strong style="color: #0f172a; font-size: 14px;">${item.name}</strong><br/>
        <span style="color: #64748b; font-size: 12px;">Brand: ${item.brand || 'Luxury'} ${item.selectedSize ? `| Size: ${item.selectedSize}` : ''}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #0f172a; font-weight: 600;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0f172a;">${formatRupees(item.price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #0f172a;">${formatRupees(item.price * item.quantity)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${order.id} - ${storeName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 30px;
      background: #f8fafc;
      color: #1e293b;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .invoice-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #e0e7ff;
      color: #4338ca;
      font-weight: 800;
      font-size: 11px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    .info-box {
      background: #f8fafc;
      padding: 18px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    .info-box h4 {
      margin: 0 0 8px 0;
      font-size: 11px;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .info-box p {
      margin: 2px 0;
      font-size: 13px;
      color: #1e293b;
      line-height: 1.5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #f1f5f9;
      padding: 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
      font-weight: 700;
    }
    .totals-area {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
    .totals-table {
      width: 320px;
    }
    .totals-table td {
      padding: 6px 12px;
      font-size: 13px;
    }
    .grand-total {
      border-top: 2px solid #e2e8f0;
      font-size: 16px !important;
      font-weight: 800;
      color: ${primaryColor};
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      margin-top: 36px;
      padding-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
    }
    .print-btn {
      display: block;
      margin: 20px auto 0 auto;
      padding: 12px 28px;
      background: ${primaryColor};
      color: #fff;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .invoice-card { box-shadow: none; border: none; padding: 0; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand-title">${storeName}</div>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Official Flagship Luxury &amp; Lifestyle Store</p>
        <p style="margin: 2px 0 0 0; font-size: 11px; color: #94a3b8;">GSTIN: 27AABCB1234F1Z5 | PAN: AABCB1234F</p>
      </div>
      <div style="text-align: right;">
        <span class="invoice-badge">TAX INVOICE</span>
        <h3 style="margin: 8px 0 2px 0; font-size: 18px; color: #0f172a; font-family: monospace;">${order.id}</h3>
        <p style="margin: 0; font-size: 12px; color: #64748b;">Date: ${orderDate}</p>
        <p style="margin: 0; font-size: 11px; color: #10b981; font-weight: bold;">Status: ${order.status}</p>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <h4>Sold By (Merchant)</h4>
        <p><strong>${storeName} Retail India Pvt. Ltd.</strong></p>
        <p>Plot 45, BKC Financial District</p>
        <p>Bandra East, Mumbai, MH - 400051</p>
        <p>Email: billing@brandbazaar.in</p>
      </div>

      <div class="info-box">
        <h4>Bill To / Ship To (Customer)</h4>
        <p><strong>${order.customer.fullName}</strong></p>
        <p>${order.customer.street}</p>
        <p>${order.customer.city}, ${order.customer.state} - ${order.customer.zipCode}</p>
        <p>Phone: ${order.customer.phone} | Email: ${order.customer.email}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: center; width: 40px;">#</th>
          <th style="text-align: left;">Item Description</th>
          <th style="text-align: center; width: 60px;">Qty</th>
          <th style="text-align: right; width: 120px;">Unit Price</th>
          <th style="text-align: right; width: 120px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="totals-area">
      <table class="totals-table">
        <tr>
          <td style="color: #64748b;">Bag Subtotal:</td>
          <td style="text-align: right; font-weight: 600;">${formatRupees(subtotal)}</td>
        </tr>
        ${order.discount ? `
        <tr>
          <td style="color: #10b981; font-weight: 600;">Coupon Discount (${order.couponCode || 'Promo'}):</td>
          <td style="text-align: right; font-weight: 700; color: #10b981;">- ${formatRupees(order.discount)}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="color: #64748b;">Central GST (CGST 2.5%):</td>
          <td style="text-align: right; font-weight: 600;">${formatRupees(cgst)}</td>
        </tr>
        <tr>
          <td style="color: #64748b;">State GST (SGST 2.5%):</td>
          <td style="text-align: right; font-weight: 600;">${formatRupees(sgst)}</td>
        </tr>
        <tr>
          <td style="color: #64748b;">Express Delivery:</td>
          <td style="text-align: right; font-weight: 600; color: #10b981;">${shipping === 0 ? 'FREE' : formatRupees(shipping)}</td>
        </tr>
        <tr class="grand-total">
          <td>Grand Total Paid:</td>
          <td style="text-align: right;">${formatRupees(total)}</td>
        </tr>
        <tr>
          <td colspan="2" style="font-size: 11px; color: #64748b; padding-top: 8px;">
            Payment Method: <strong>${order.paymentMethod}</strong> (Status: ${order.paymentStatus || 'PAID'})<br/>
            ${order.trackingNumber ? `AWB Tracking: <strong>${order.trackingNumber}</strong> (Blue Dart)` : ''}
          </td>
        </tr>
      </table>
    </div>

    <div class="footer">
      <p>This is a computer-generated tax invoice and requires no physical signature &bull; 100% Authenticity Guarantee</p>
      <p>Thank you for choosing <strong>${storeName}</strong>. For inquiries, contact support@brandbazaar.in.</p>
    </div>

    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
</body>
</html>
  `;
};

export const downloadOrderInvoice = (order: Order, branding?: StoreBrandingSettings) => {
  const html = generateInvoiceHtml(order, branding);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice_${order.id}_${branding?.storeName?.replace(/\s+/g, '_') || 'BrandBazaar'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const openInvoicePrintWindow = (order: Order, branding?: StoreBrandingSettings) => {
  const html = generateInvoiceHtml(order, branding);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
