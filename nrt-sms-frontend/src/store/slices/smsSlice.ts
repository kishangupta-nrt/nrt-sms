import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SMSRecord } from '../../types';

interface SMSState {
  records: SMSRecord[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: SMSState = {
  records: [],
  total: 0,
  loading: false,
  error: null,
};

const smsSlice = createSlice({
  name: 'sms',
  initialState,
  reducers: {
    setRecords(state, action: PayloadAction<{ data: SMSRecord[]; total: number }>) {
      state.records = action.payload.data;
      state.total = action.payload.total;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setRecords, setLoading, setError } = smsSlice.actions;
export default smsSlice.reducer;
