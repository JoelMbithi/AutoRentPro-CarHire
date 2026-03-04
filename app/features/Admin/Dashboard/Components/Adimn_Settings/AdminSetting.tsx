"use client";

import React, { useState } from 'react';
import {
  Settings, Shield, Bell, Key, CreditCard, Users, Database,
  CloudUpload, Search, Eye, Edit, UserX, Download, Trash2,
  RefreshCw, Save, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';

// ── types ─────────────────────────────────────────────────────────────────────
type Tab = 'general' | 'security' | 'notifications' | 'password' | 'payment' | 'users' | 'backup' | 'logs';

interface AdminSettings {
  siteName: string; primaryColor: string; currency: string; timezone: string;
  maxBookingDays: number; minRentalAge: number; securityLevel: 'low' | 'medium' | 'high';
  enableTwoFactor: boolean; sessionTimeout: number; maintenanceMode: boolean;
  allowRegistration: boolean; requireEmailVerification: boolean;
  emailNotifications: boolean; smsNotifications: boolean; pushNotifications: boolean;
  taxRate: number; commissionRate: number; lateFeePerDay: number;
}

interface UserLog { id: string; userId: string; userName: string; action: string; ipAddress: string; timestamp: string; status: 'success' | 'failed'; }
interface User    { id: string; name: string; email: string; role: 'admin' | 'manager' | 'agent' | 'customer'; status: 'active' | 'inactive' | 'suspended'; lastLogin: string; }

// ── reusable toggle ───────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
    className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-gray-900' : 'bg-gray-200'}`}
  >
    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
  </button>
);

// ── field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white outline-none focus:border-gray-400 transition-colors";

// ── row toggle ────────────────────────────────────────────────────────────────
const ToggleRow = ({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
    <div>
      <div className="text-sm font-medium text-gray-800">{label}</div>
      <div className="text-xs text-gray-400">{sub}</div>
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

// ── seed data ─────────────────────────────────────────────────────────────────
const SEED_LOGS: UserLog[] = [
  { id: '1', userId: 'USR001', userName: 'John Doe',    action: 'Login',                ipAddress: '192.168.1.100', timestamp: '2024-01-20 10:30', status: 'success' },
  { id: '2', userId: 'USR002', userName: 'Jane Smith',  action: 'Failed Login Attempt', ipAddress: '192.168.1.101', timestamp: '2024-01-20 10:25', status: 'failed'  },
  { id: '3', userId: 'USR003', userName: 'Admin User',  action: 'Settings Updated',     ipAddress: '192.168.1.1',   timestamp: '2024-01-20 10:20', status: 'success' },
  { id: '4', userId: 'USR004', userName: 'Car Agent',   action: 'Car Added',            ipAddress: '192.168.1.102', timestamp: '2024-01-20 10:15', status: 'success' },
  { id: '5', userId: 'USR005', userName: 'Customer',    action: 'Booking Created',      ipAddress: '192.168.1.103', timestamp: '2024-01-20 10:10', status: 'success' },
];

const SEED_USERS: User[] = [
  { id: '1', name: 'Admin User',    email: 'admin@autorent.com',     role: 'admin',    status: 'active',    lastLogin: '2024-01-20 10:30' },
  { id: '2', name: 'Manager User',  email: 'manager@autorent.com',   role: 'manager',  status: 'active',    lastLogin: '2024-01-20 09:45' },
  { id: '3', name: 'Agent User',    email: 'agent@autorent.com',     role: 'agent',    status: 'active',    lastLogin: '2024-01-19 16:20' },
  { id: '4', name: 'Customer User', email: 'customer@example.com',   role: 'customer', status: 'active',    lastLogin: '2024-01-20 08:15' },
  { id: '5', name: 'Suspended',     email: 'suspended@example.com',  role: 'customer', status: 'suspended', lastLogin: '2024-01-15 14:30' },
];

const ROLE_STYLE: Record<string, string>   = { admin: 'bg-violet-50 text-violet-700', manager: 'bg-blue-50 text-blue-700', agent: 'bg-indigo-50 text-indigo-700', customer: 'bg-gray-100 text-gray-600' };
const STATUS_STYLE: Record<string, string> = { active: 'text-emerald-600', inactive: 'text-amber-600', suspended: 'text-red-500' };
const STATUS_DOT: Record<string, string>   = { active: 'bg-emerald-400', inactive: 'bg-amber-400', suspended: 'bg-red-400' };

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'general',       label: 'General',        icon: <Settings size={14} />   },
  { key: 'security',      label: 'Security',       icon: <Shield size={14} />     },
  { key: 'notifications', label: 'Notifications',  icon: <Bell size={14} />       },
  { key: 'password',      label: 'Password',       icon: <Key size={14} />        },
  { key: 'payment',       label: 'Payment & Fees', icon: <CreditCard size={14} /> },
  { key: 'users',         label: 'Users',          icon: <Users size={14} />      },
  { key: 'backup',        label: 'Backup',         icon: <CloudUpload size={14} />},
  { key: 'logs',          label: 'Logs',           icon: <Database size={14} />   },
];

const NOTIF_EVENTS = ['New user registration', 'Failed login attempts', 'System maintenance', 'Payment processing', 'Booking confirmation', 'Support ticket updates'];

// ── component ─────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [tab, setTab]         = useState<Tab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [backupModal, setBackupModal] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [logSearch, setLogSearch]     = useState('');
  const [logStatus, setLogStatus]     = useState<'all' | 'success' | 'failed'>('all');
  const [userLogs, setUserLogs]       = useState<UserLog[]>(SEED_LOGS);
  const [users]                       = useState<User[]>(SEED_USERS);

  const [s, setS] = useState<AdminSettings>({
    siteName: 'AutoRentPro', primaryColor: '#FF6B35', currency: 'KSH',
    timezone: 'Africa/Nairobi', maxBookingDays: 30, minRentalAge: 21,
    securityLevel: 'high', enableTwoFactor: true, sessionTimeout: 30,
    maintenanceMode: false, allowRegistration: true, requireEmailVerification: true,
    emailNotifications: true, smsNotifications: true, pushNotifications: true,
    taxRate: 16, commissionRate: 10, lateFeePerDay: 5000,
  });

  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });

  const set = (k: keyof AdminSettings, v: any) => setS(p => ({ ...p, [k]: v }));

  const save = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    alert('Saved!');
  };

  const resetDefaults = () => {
    setS(p => ({ ...p, siteName: 'AutoRentPro', primaryColor: '#FF6B35', currency: 'KSH', timezone: 'Africa/Nairobi', maxBookingDays: 30, minRentalAge: 21, securityLevel: 'high', enableTwoFactor: true, sessionTimeout: 30, maintenanceMode: false, allowRegistration: true, requireEmailVerification: true, taxRate: 16, commissionRate: 10, lateFeePerDay: 5000 }));
    setResetModal(false);
  };

  const changePassword = async () => {
    if (pwd.next !== pwd.confirm) { alert('Passwords do not match'); return; }
    if (pwd.next.length < 8)     { alert('Minimum 8 characters');   return; }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    setPwd({ current: '', next: '', confirm: '' });
    alert('Password changed!');
  };

  const backup = async () => {
    setIsBackingUp(true); setBackupProgress(0);
    for (let i = 0; i <= 100; i += 10) { await new Promise(r => setTimeout(r, 200)); setBackupProgress(i); }
    setIsBackingUp(false); setBackupModal(false);
    alert('Backup complete!');
  };

  const exportLogs = () => {
    const csv = ['ID,User,Action,IP,Time,Status', ...filteredLogs.map(l => `${l.id},${l.userName},${l.action},${l.ipAddress},${l.timestamp},${l.status}`)].join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'logs.csv'; a.click();
  };

  const filteredLogs = userLogs
    .filter(l => logStatus === 'all' || l.status === logStatus)
    .filter(l => !logSearch || [l.userName, l.action, l.ipAddress].some(f => f.toLowerCase().includes(logSearch.toLowerCase())));

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Platform configuration</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setResetModal(true)} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={13} /> Reset defaults
          </button>
          <button onClick={save} disabled={isSaving} className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors">
            {isSaving ? <><RefreshCw size={13} className="animate-spin" /> Saving…</> : <><Save size={13} /> Save changes</>}
          </button>
        </div>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row items-start">

        {/* sidebar nav */}
        <div className="w-full lg:w-48 shrink-0 bg-white border border-gray-200 rounded-xl p-2">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors mb-0.5 last:mb-0 ${
                tab === t.key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5">

          {/* ── General ── */}
          {tab === 'general' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-gray-800">General</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Site name"><input className={inputCls} value={s.siteName} onChange={e => set('siteName', e.target.value)} /></Field>
                <Field label="Currency">
                  <select className={inputCls} value={s.currency} onChange={e => set('currency', e.target.value)}>
                    <option value="KSH">KSH – Kenyan Shilling</option>
                    <option value="USD">USD – US Dollar</option>
                    <option value="EUR">EUR – Euro</option>
                    <option value="GBP">GBP – British Pound</option>
                  </select>
                </Field>
                <Field label="Timezone">
                  <select className={inputCls} value={s.timezone} onChange={e => set('timezone', e.target.value)}>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </Field>
                <Field label="Primary color">
                  <div className="flex gap-2">
                    <input type="color" value={s.primaryColor} onChange={e => set('primaryColor', e.target.value)} className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-0.5" />
                    <input className={inputCls} value={s.primaryColor} onChange={e => set('primaryColor', e.target.value)} />
                  </div>
                </Field>
                <Field label="Max booking days"><input type="number" className={inputCls} value={s.maxBookingDays} min={1} max={365} onChange={e => set('maxBookingDays', +e.target.value)} /></Field>
                <Field label="Min rental age"><input type="number" className={inputCls} value={s.minRentalAge} min={18} max={100} onChange={e => set('minRentalAge', +e.target.value)} /></Field>
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {tab === 'security' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Security</h2>
              <ToggleRow label="Two-factor authentication" sub="Require 2FA for admin access"  checked={s.enableTwoFactor}          onChange={v => set('enableTwoFactor', v)} />
              <ToggleRow label="Maintenance mode"          sub="Take site offline temporarily"  checked={s.maintenanceMode}          onChange={v => set('maintenanceMode', v)} />
              <ToggleRow label="Allow registration"        sub="Let new users sign up"          checked={s.allowRegistration}        onChange={v => set('allowRegistration', v)} />
              <ToggleRow label="Email verification"        sub="Require email on signup"        checked={s.requireEmailVerification} onChange={v => set('requireEmailVerification', v)} />
              <div className="pt-2">
                <Field label="Session timeout (minutes)">
                  <input type="number" className={inputCls} value={s.sessionTimeout} min={5} max={240} onChange={e => set('sessionTimeout', +e.target.value)} />
                </Field>
              </div>
              <div className="pt-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Security level</p>
                <div className="flex gap-4">
                  {(['low', 'medium', 'high'] as const).map(lv => (
                    <label key={lv} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="secLv" checked={s.securityLevel === lv} onChange={() => set('securityLevel', lv)} className="accent-gray-900" />
                      <span className="text-sm capitalize text-gray-700">{lv}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {tab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Notifications</h2>
              <ToggleRow label="Email notifications" sub="Alerts for important events"       checked={s.emailNotifications} onChange={v => set('emailNotifications', v)} />
              <ToggleRow label="SMS notifications"   sub="Alerts for urgent notifications"  checked={s.smsNotifications}   onChange={v => set('smsNotifications', v)} />
              <ToggleRow label="Push notifications"  sub="Browser/device push alerts"       checked={s.pushNotifications}  onChange={v => set('pushNotifications', v)} />
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Notify on</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {NOTIF_EVENTS.map(e => (
                    <label key={e} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-gray-900 rounded" />
                      <span className="text-sm text-gray-700">{e}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Password ── */}
          {tab === 'password' && (
            <div className="space-y-5 max-w-sm">
              <h2 className="text-base font-semibold text-gray-800">Change password</h2>
              <Field label="Current password"><input type="password" className={inputCls} value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" /></Field>
              <Field label="New password">
                <input type="password" className={inputCls} value={pwd.next} onChange={e => setPwd(p => ({ ...p, next: e.target.value }))} placeholder="••••••••" />
                <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
              </Field>
              <Field label="Confirm new password"><input type="password" className={inputCls} value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" /></Field>
              <button onClick={changePassword} disabled={isSaving || !pwd.current || !pwd.next || !pwd.confirm} className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors">
                {isSaving ? 'Saving…' : 'Update password'}
              </button>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500 space-y-1">
                <p>· Minimum 8 characters</p>
                <p>· Include uppercase and lowercase letters</p>
                <p>· Include at least one number</p>
                <p>· Include a special character (!@#$%^&amp;*)</p>
              </div>
            </div>
          )}

          {/* ── Payment ── */}
          {tab === 'payment' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Payment & Fees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Tax rate (%)"><input type="number" className={inputCls} value={s.taxRate} step={0.1} min={0} max={50} onChange={e => set('taxRate', +e.target.value)} /></Field>
                <Field label="Commission rate (%)"><input type="number" className={inputCls} value={s.commissionRate} step={0.1} min={0} max={50} onChange={e => set('commissionRate', +e.target.value)} /></Field>
                <Field label="Late fee per day (KSH)"><input type="number" className={inputCls} value={s.lateFeePerDay} min={0} onChange={e => set('lateFeePerDay', +e.target.value)} /></Field>
                <Field label="Refund policy">
                  <select className={inputCls}>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="0">No refund</option>
                  </select>
                </Field>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-gray-600">Payment gateway · <span className="text-emerald-600 font-medium">Healthy</span></span>
              </div>
            </div>
          )}

          {/* ── Users ── */}
          {tab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">User management</h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors">
                  <Users size={13} /> Add user
                </button>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                <input placeholder="Search users…" className={`${inputCls} pl-8`} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['User', 'Role', 'Status', 'Last login', ''].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">
                        <td className="px-3 py-3">
                          <div className="font-medium text-gray-800">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_STYLE[u.role]}`}>{u.role}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[u.status]}`} />
                            <span className={`text-xs font-medium capitalize ${STATUS_STYLE[u.status]}`}>{u.status}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-400">{u.lastLogin}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"><Eye size={13} /></button>
                            <button className="p-1.5 rounded-md hover:bg-gray-100 text-blue-400 transition-colors"><Edit size={13} /></button>
                            <button className="p-1.5 rounded-md hover:bg-gray-100 text-red-400 transition-colors"><UserX size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Backup ── */}
          {tab === 'backup' && (
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-gray-800">Backup & Restore</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* create */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Create backup</p>
                  {[
                    ['includeDatabase', 'Database'],
                    ['includeFiles',    'Files'],
                    ['includeLogs',     'Logs'],
                    ['encryption',      'Encrypt backup'],
                  ].map(([k, label]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{label}</span>
                      <Toggle checked={true} onChange={() => {}} />
                    </div>
                  ))}
                  <button onClick={() => setBackupModal(true)} className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors mt-2">
                    Create backup now
                  </button>
                </div>

                {/* restore */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Restore from backup</p>
                  {[
                    { label: 'Jan 20, 2024', size: '2.5 GB', note: 'Complete system backup' },
                    { label: 'Jan 15, 2024', size: '2.3 GB', note: 'Database only' },
                  ].map(b => (
                    <div key={b.label} className="p-3 border border-gray-100 rounded-lg">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{b.label}</span>
                        <span className="text-gray-400">{b.size}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{b.note}</p>
                      <button className="w-full py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">Restore</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-6 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
                <span>Last backup: <strong className="text-gray-700">Jan 20, 2024 10:30 AM</strong></span>
                <span>Storage: <strong className="text-gray-700">75%</strong></span>
                <span>Auto backup: <strong className="text-gray-700">Daily 2:00 AM</strong></span>
              </div>
            </div>
          )}

          {/* ── Logs ── */}
          {tab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-base font-semibold text-gray-800">Activity logs</h2>
                <div className="flex gap-2">
                  <button onClick={exportLogs} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <Download size={13} /> Export
                  </button>
                  <button onClick={() => { if (confirm('Clear all logs?')) setUserLogs([]); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-400 rounded-lg text-sm hover:bg-red-50 transition-colors">
                    <Trash2 size={13} /> Clear
                  </button>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  <input value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Search logs…" className={`${inputCls} pl-8`} />
                </div>
                <select value={logStatus} onChange={e => setLogStatus(e.target.value as any)} className={`${inputCls} w-auto`}>
                  <option value="all">All</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-300">No logs found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['User', 'Action', 'IP', 'Time', 'Status'].map(h => (
                          <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map(l => (
                        <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">
                          <td className="px-3 py-3">
                            <div className="font-medium text-gray-800">{l.userName}</div>
                            <div className="text-xs text-gray-400 font-mono">{l.userId}</div>
                          </td>
                          <td className="px-3 py-3 text-gray-600">{l.action}</td>
                          <td className="px-3 py-3 font-mono text-xs text-gray-400">{l.ipAddress}</td>
                          <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">{l.timestamp}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1.5">
                              {l.status === 'success'
                                ? <CheckCircle size={13} className="text-emerald-500" />
                                : <XCircle    size={13} className="text-red-400" />
                              }
                              <span className={`text-xs font-medium ${l.status === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                                {l.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Reset modal ── */}
      {resetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
            <AlertTriangle size={32} className="text-amber-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Reset to defaults?</h3>
            <p className="text-sm text-gray-400 mb-5">All settings will be reverted. This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setResetModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={resetDefaults} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Backup modal ── */}
      {backupModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Create backup</h3>
            <p className="text-sm text-gray-400 mb-5">~2.5 GB · 3–5 minutes. Didn&apos;t close this window.</p>

            {isBackingUp ? (
              <div className="space-y-3">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto" />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{backupProgress < 30 ? 'Preparing…' : backupProgress < 60 ? 'Backing up DB…' : backupProgress < 90 ? 'Compressing…' : 'Finalizing…'}</span>
                  <span>{backupProgress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full transition-all duration-300" style={{ width: `${backupProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setBackupModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={backup} className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">Start backup</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}