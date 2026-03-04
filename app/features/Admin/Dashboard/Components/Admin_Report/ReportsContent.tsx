"use client";

import React, { useState } from 'react';
import { FileText, Download, Eye, RefreshCw, Search, ChevronDown, TrendingUp, Users, Car, Database, BarChart2 } from 'lucide-react';

type ReportType   = 'financial' | 'user' | 'booking' | 'system' | 'analytics';
type ReportStatus = 'generated' | 'processing' | 'failed';

interface Report {
  id: string;
  title: string;
  type: ReportType;
  description: string;
  dateGenerated: string;
  fileSize: string;
  status: ReportStatus;
  downloads: number;
  lastAccessed: string;
}

const STATUS: Record<ReportStatus, { dot: string; text: string; label: string }> = {
  generated:  { dot: 'bg-emerald-400', text: 'text-emerald-700', label: 'Generated'  },
  processing: { dot: 'bg-amber-400',   text: 'text-amber-700',   label: 'Processing' },
  failed:     { dot: 'bg-red-400',     text: 'text-red-700',     label: 'Failed'     },
};

const TYPE_ICON: Record<ReportType, React.ReactNode> = {
  financial: <TrendingUp size={13} className="text-emerald-600" />,
  user:      <Users      size={13} className="text-blue-500"    />,
  booking:   <Car        size={13} className="text-violet-500"  />,
  system:    <Database   size={13} className="text-amber-500"   />,
  analytics: <BarChart2  size={13} className="text-indigo-500"  />,
};

const TABS = ['all', 'financial', 'user', 'booking', 'system', 'analytics'] as const;

const SEED: Report[] = [
  { id: '1', title: 'Monthly Revenue Report',    type: 'financial', description: 'Complete financial analysis with revenue breakdown', dateGenerated: '2024-01-20', fileSize: '2.4 MB', status: 'generated',  downloads: 45, lastAccessed: '2024-01-20' },
  { id: '2', title: 'User Activity Analytics',    type: 'user',      description: 'User engagement metrics and behavior patterns',      dateGenerated: '2024-01-19', fileSize: '1.8 MB', status: 'generated',  downloads: 32, lastAccessed: '2024-01-20' },
  { id: '3', title: 'Booking Performance',         type: 'booking',   description: 'Booking statistics and conversion rates',            dateGenerated: '2024-01-18', fileSize: '3.2 MB', status: 'processing', downloads: 0,  lastAccessed: '-'          },
  { id: '4', title: 'System Usage Report',         type: 'system',    description: 'Server performance and resource utilization',        dateGenerated: '2024-01-17', fileSize: '4.1 MB', status: 'generated',  downloads: 21, lastAccessed: '2024-01-19' },
  { id: '5', title: 'Customer Demographics',       type: 'analytics', description: 'Customer segmentation and demographic analysis',     dateGenerated: '2024-01-16', fileSize: '1.5 MB', status: 'generated',  downloads: 28, lastAccessed: '2024-01-18' },
  { id: '6', title: 'Quarterly Financial Summary', type: 'financial', description: 'Q4 financial performance and projections',          dateGenerated: '2024-01-15', fileSize: '5.2 MB', status: 'failed',     downloads: 0,  lastAccessed: '-'          },
];

export default function ReportsContent() {
  const [reports, setReports]           = useState<Report[]>(SEED);
  const [selected, setSelected]         = useState<string[]>([]);
  const [typeFilter, setTypeFilter]     = useState('all');
  const [search, setSearch]             = useState('');
  const [sortBy, setSortBy]             = useState<'date' | 'downloads' | 'title'>('date');
  const [isGenerating, setIsGenerating] = useState(false);
  const [openExport, setOpenExport]     = useState<string | null>(null);

  const filtered = reports
    .filter(r => typeFilter === 'all' || r.type === typeFilter)
    .filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'title')     return a.title.localeCompare(b.title);
      return b.dateGenerated.localeCompare(a.dateGenerated);
    });

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    setIsGenerating(false);
    setReports(prev => [{
      id: Date.now().toString(), title: 'New Custom Report', type: 'analytics',
      description: 'Custom report generated from selected parameters',
      dateGenerated: new Date().toISOString().split('T')[0],
      fileSize: '—', status: 'processing', downloads: 0, lastAccessed: '-',
    }, ...prev]);
  };

  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));

  return (
    <div onClick={() => setOpenExport(null)}>

      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">{reports.length} reports</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isGenerating
            ? <><RefreshCw size={13} className="animate-spin" /> Generating…</>
            : <><FileText size={13} /> Generate report</>}
        </button>
      </div>

      {/* card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* toolbar */}
        <div className="flex items-center gap-2 flex-wrap px-4 py-3 border-b border-gray-100">
          <div className="flex gap-1 flex-wrap flex-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  typeFilter === t ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {t === 'all' ? 'All' : t}
                <span className="ml-1 text-xs opacity-50">
                  {t === 'all' ? reports.length : reports.filter(r => r.type === t).length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none focus:border-gray-400 w-36"
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-gray-50 outline-none"
          >
            <option value="date">Date</option>
            <option value="downloads">Downloads</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* table */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-300">No reports found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-2.5 w-8">
                    <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-gray-300" />
                  </th>
                  {['Report', 'Type', 'Date', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-300 last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const st = STATUS[r.status];
                  return (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} className="rounded border-gray-300" />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                            {TYPE_ICON[r.type]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{r.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{r.description}</div>
                            <div className="text-xs text-gray-300 mt-1">{r.downloads} downloads · {r.fileSize}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 capitalize">{r.type}</span>
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        <div>{r.dateGenerated}</div>
                        {r.lastAccessed !== '-' && <div className="text-gray-300">accessed {r.lastAccessed}</div>}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"><Eye size={14} /></button>
                          <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"><Download size={14} /></button>
                          <div className="relative">
                            <button
                              onClick={() => setOpenExport(openExport === r.id ? null : r.id)}
                              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"
                            >
                              <ChevronDown size={14} />
                            </button>
                            {openExport === r.id && (
                              <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-xl shadow-md py-1 z-10">
                                {['Excel', 'PDF', 'CSV', 'PNG'].map(fmt => (
                                  <button key={fmt} onClick={() => { alert(`Export as ${fmt}`); setOpenExport(null); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                                    {fmt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400 flex-wrap gap-2">
          <span>{filtered.length} of {reports.length} reports</span>
          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <span>{selected.length} selected</span>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Bulk export</button>
              <button className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}