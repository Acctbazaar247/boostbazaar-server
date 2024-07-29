import axios from 'axios';
import config from '../config';

async function getInvoiceUrl(orderId: string): Promise<string | null> {
  const url = `https://api.paystack.co/transaction/verify/${orderId}`;
  const headers = {
    Authorization: `Bearer ${config.paystackPaymentApiKey}`,
  };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data;
    if (data.status) {
      return data.data.metadata.invoice_url;
    }
    return null;
  } catch (error) {
    return null;
  }
}
export default getInvoiceUrl;
