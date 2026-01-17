interface OrderItem {
  item_name: string;
  item_price: number;
  quantity: number;
  is_veg: boolean;
}

interface Order {
  id: string;
  order_number: number;
  table_number: number | null;
  order_type: 'dine_in' | 'takeaway';
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export function generateInvoiceHTML(order: Order): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
        <span style="display: inline-block; width: 12px; height: 12px; border: 2px solid ${item.is_veg ? '#22c55e' : '#ef4444'}; border-radius: 2px; margin-right: 8px;"></span>
        ${item.item_name}
      </td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">₹${item.item_price}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">₹${item.item_price * item.quantity}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${order.order_number} - Coffee Nivasa</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
        .invoice { max-width: 400px; margin: 0 auto; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px dashed #ccc; }
        .logo { font-size: 24px; font-weight: bold; color: #b45309; margin-bottom: 4px; }
        .tagline { font-size: 12px; color: #888; }
        .order-info { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; }
        .order-info div { line-height: 1.6; }
        .order-number { font-size: 20px; font-weight: bold; color: #b45309; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        th { text-align: left; padding: 8px 0; border-bottom: 2px solid #333; font-weight: 600; }
        th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
        th:nth-child(2) { text-align: center; }
        .totals { border-top: 2px dashed #ccc; padding-top: 12px; margin-top: 12px; }
        .totals div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
        .totals .total { font-size: 18px; font-weight: bold; color: #b45309; padding-top: 8px; border-top: 1px solid #eee; margin-top: 8px; }
        .footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 2px dashed #ccc; font-size: 12px; color: #888; }
        .footer p { margin: 4px 0; }
        @media print {
          body { background: white; padding: 0; }
          .invoice { box-shadow: none; max-width: 100%; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div class="logo">☕ Coffee Nivasa</div>
          <div class="tagline">Fresh Coffee & Delicious Food</div>
        </div>
        
        <div class="order-info">
          <div>
            <div class="order-number">#${order.order_number}</div>
            <div>${order.order_type === 'dine_in' ? `Table ${order.table_number}` : 'Takeaway'}</div>
          </div>
          <div style="text-align: right;">
            <div>${formatDate(order.created_at)}</div>
            ${order.customer_name ? `<div>${order.customer_name}</div>` : ''}
            ${order.customer_phone ? `<div>${order.customer_phone}</div>` : ''}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>
        
        <div class="totals">
          <div><span>Subtotal</span><span>₹${order.subtotal}</span></div>
          <div><span>Tax (5%)</span><span>₹${order.tax}</span></div>
          <div class="total"><span>Total</span><span>₹${order.total}</span></div>
        </div>
        
        <div class="footer">
          <p>Thank you for visiting!</p>
          <p>See you again soon ☕</p>
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 12px 24px; background: #b45309; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer;">
          Print Invoice
        </button>
      </div>
    </body>
    </html>
  `;
}

export function printInvoice(order: Order): void {
  const invoiceHTML = generateInvoiceHTML(order);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  }
}

export function downloadInvoice(order: Order): void {
  const invoiceHTML = generateInvoiceHTML(order);
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${order.order_number}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
