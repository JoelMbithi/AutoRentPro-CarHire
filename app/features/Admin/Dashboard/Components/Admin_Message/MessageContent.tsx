'use client';

import React, { useEffect, useState } from 'react';
import { Mail, User, Phone, Eye, EyeOff, Search, Trash2, Reply, Car, ChevronDown, ChevronUp } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  rentalType?: string;
  isRead: boolean;
  createdAt: string;
}

const fmtDate = (d: string) => {
  const date = new Date(d);
  const now = new Date();
  const days = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (days === 0) return 'Today · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (days === 1) return 'Yesterday · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (days < 7)  return `${days} days ago`;
  return date.toLocaleDateString();
};

export default function MessageContent() {
  const [messages, setMessages]           = useState<Message[]>([]);
  const [loading, setLoading]             = useState(true);
  const [expanded, setExpanded]           = useState<string | null>(null);
  const [filter, setFilter]               = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch]               = useState('');
  const [sortNewest, setSortNewest]       = useState(true);

  useEffect(() => {
    fetch('/features/ContactUs/api/contacts')
      .then(r => r.json())
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead   = (id: string) => setMessages(m => m.map(x => x.id === id ? { ...x, isRead: true  } : x));
  const markUnread = (id: string) => setMessages(m => m.map(x => x.id === id ? { ...x, isRead: false } : x));
  const del        = (id: string) => { if (confirm('Delete this message?')) setMessages(m => m.filter(x => x.id !== id)); };

  const filtered = messages
    .filter(m => filter === 'all' || (filter === 'unread' ? !m.isRead : m.isRead))
    .filter(m => !search || [m.name, m.email, m.subject, m.message].some(f => f.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      const d = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortNewest ? d : -d;
    });

  const unread = messages.filter(m => !m.isRead).length;

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div>

      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {messages.length} total · {unread} unread
          </p>
        </div>
      </div>

      {/* toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-2 mb-4">
        {/* filter tabs */}
        <div className="flex gap-1 flex-1">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {f}
              <span className="ml-1 text-xs opacity-50">
                {f === 'all' ? messages.length : messages.filter(m => f === 'unread' ? !m.isRead : m.isRead).length}
              </span>
            </button>
          ))}
        </div>

        {/* search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none focus:border-gray-400 w-40"
          />
        </div>

        {/* sort */}
        <button
          onClick={() => setSortNewest(s => !s)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          {sortNewest ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center text-sm text-gray-300">
          No messages found
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(msg => {
            const isOpen = expanded === msg.id;
            return (
              <div
                key={msg.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all ${
                  msg.isRead ? 'border-gray-200' : 'border-l-4 border-l-orange-400 border-gray-200'
                }`}
              >
                {/* summary row */}
                <div
                  className="px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setExpanded(isOpen ? null : msg.id);
                    if (!msg.isRead) markRead(msg.id);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {!msg.isRead && <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />}
                        <span className="font-medium text-gray-800 truncate">{msg.subject}</span>
                        {msg.rentalType && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full shrink-0">
                            <Car size={10} /> {msg.rentalType}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1"><User size={11} /> {msg.name}</span>
                        <span className="flex items-center gap-1"><Mail size={11} /> {msg.email}</span>
                        {msg.phone && <span className="flex items-center gap-1"><Phone size={11} /> {msg.phone}</span>}
                      </div>
                      {!isOpen && (
                        <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{msg.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-300 whitespace-nowrap">{fmtDate(msg.createdAt)}</span>
                      {isOpen ? <ChevronUp size={14} className="text-gray-300" /> : <ChevronDown size={14} className="text-gray-300" />}
                    </div>
                  </div>
                </div>

                {/* expanded */}
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap py-4">{msg.message}</p>

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-300">{new Date(msg.createdAt).toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => msg.isRead ? markUnread(msg.id) : markRead(msg.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          {msg.isRead ? <><EyeOff size={12} /> Mark unread</> : <><Eye size={12} /> Mark read</>}
                        </button>
                        <button
                          onClick={() => alert(`Reply to ${msg.email}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors"
                        >
                          <Reply size={12} /> Reply
                        </button>
                        <button
                          onClick={() => del(msg.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-400 rounded-lg text-xs hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* footer */}
      {filtered.length > 0 && (
        <div className="mt-4 text-xs text-gray-300 text-right">
          {filtered.length} of {messages.length} messages
        </div>
      )}
    </div>
  );
}