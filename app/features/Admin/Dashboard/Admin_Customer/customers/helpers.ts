export const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const AVATAR_COLORS = [
  'bg-orange-400', 'bg-blue-400', 'bg-violet-400', 
  'bg-emerald-400', 'bg-pink-400', 'bg-amber-400'
];

export const avatarColor = (id: string) => 
  AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

export const ROLE_STYLES: Record<string, string> = {
  VIP:      'bg-violet-50 text-violet-700',
  PREMIUM:  'bg-blue-50 text-blue-700',
  ADMIN:    'bg-red-50 text-red-700',
  AGENT:    'bg-emerald-50 text-emerald-700',
  CUSTOMER: 'bg-gray-100 text-gray-600',
};

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const TABS = [
  { key: 'all',      label: 'All' },
  { key: 'CUSTOMER', label: 'Customer' },

  { key: 'ADMIN',    label: 'Admin' },
  { key: 'AGENT',    label: 'Agent' },
];