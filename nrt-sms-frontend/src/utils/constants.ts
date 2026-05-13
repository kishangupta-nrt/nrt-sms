import { SidebarItem } from '../types';

export const API_BASE_URL = 'http://localhost:5000/api';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home', path: '/' },
  {
    id: 'sms',
    label: 'SMS',
    icon: 'envelope',
    children: [
      { id: 'send-sms', label: 'Send SMS', icon: 'paper-plane', path: '/sms/send' },
      { id: 'two-way', label: 'Two Way SMS', icon: 'reply', path: '/sms/two-way' },
    ],
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'whatsapp',
    children: [
      { id: 'wa-send', label: 'Send WhatsApp', icon: 'comment', path: '/whatsapp/send' },
      { id: 'wa-templates', label: 'Templates', icon: 'file', path: '/whatsapp/templates' },
      { id: 'wa-config', label: 'Configuration', icon: 'cog', path: '/whatsapp/config' },
    ],
  },
  { id: 'dlt', label: 'DLT Templates', icon: 'file-alt', path: '/dlt' },
  { id: 'sender', label: 'Sender ID', icon: 'tag', path: '/sender' },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: 'address-book',
    children: [
      { id: 'phonebook', label: 'Phonebook', icon: 'book', path: '/contacts/phonebook' },
      { id: 'groups', label: 'Groups', icon: 'users', path: '/contacts/groups' },
    ],
  },
  { id: 'campaigns', label: 'Campaigns', icon: 'bullhorn', path: '/campaigns' },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'chart-bar',
    children: [
      { id: 'report-summary', label: 'Summary', icon: 'chart-pie', path: '/reports/summary' },
      { id: 'report-detailed', label: 'Detailed', icon: 'table', path: '/reports/detailed' },
    ],
  },
  { id: 'users', label: 'Users', icon: 'user-cog', path: '/users' },
  { id: 'roles', label: 'Roles & Permissions', icon: 'shield-alt', path: '/roles' },
  { id: 'settings', label: 'Settings', icon: 'cogs', path: '/settings' },
];

export const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
];
