export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
  ability: { action: string; subject: string }[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SMSRecord {
  id: string;
  mobile: string;
  message: string;
  senderId: string;
  status: string;
  date: string;
  credits: number;
}

export interface DLTRecord {
  id: string;
  templateId: string;
  entityId: string;
  header: string;
  content: string;
  status: string;
  dltStatus: string;
}

export interface SenderID {
  id: string;
  senderId: string;
  status: string;
  created: string;
}

export interface Contact {
  id: string;
  name: string;
  mobile: string;
  email: string;
  group: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  sent: number;
  total: number;
  date: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  status: string;
  language: string;
  created: string;
}

export interface ReportSummary {
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  total: number;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: SidebarItem[];
}
