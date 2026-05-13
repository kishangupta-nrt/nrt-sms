import api from './axiosInstance';
import { SMSRecord } from '../types';

export async function fetchSMSRecords(params?: Record<string, any>): Promise<{ data: SMSRecord[]; total: number }> {
  const res = await api.get('/datatables/data', { params: { type: 'sms', ...params } });
  return res.data;
}

export async function sendSMS(data: { mobile: string; message: string; senderId: string }): Promise<any> {
  const res = await api.post('/main/send-sms', data);
  return res.data;
}
