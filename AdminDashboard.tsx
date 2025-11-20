
import React, { useState, useEffect } from 'react';
import { AffiliateLink } from '../types';
import { getAffiliateLinks, getStats, saveAffiliateLink } from '../services/storageService';

interface AdminDashboardProps {
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [stats, setStats] = useState<{ totalClicks: number; byPlatform: Record<string, number> }>({ totalClicks: 0, byPlatform: {} });
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{url: string, name: string}>({ url: '', name: '' });

  // Mock CPA (Cost Per Action) for earnings estimation
  const CPA_RATE = 20; // $20 per conversion (simulated conversion rate)

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLinks(getAffiliateLinks());
    setStats(getStats());
  };

  const handleEdit = (link: AffiliateLink) => {
    setIsEditing(link.id);
    setEditForm({ url: link.url, name: link.platformName });
  };

  const handleSave = (id: string) => {
    const linkToUpdate = links.find(l => l.id === id);
    if (linkToUpdate) {
      const updated = { ...linkToUpdate, url: editForm.url, platformName: editForm.name };
      saveAffiliateLink(updated);
      setIsEditing(null);
      loadData();
    }
  };

  const estimatedEarnings = Math.floor(stats.totalClicks * 0.15) * CPA_RATE; // Assume 15% conversion rate

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage referral partners and track performance</p>
          </div>
          <button onClick={onExit} className="text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-4 py-2 rounded-lg transition-colors">
            Exit Admin
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-brand-100 text-sm font-medium mb-1">Total Link Clicks</p>
            <h2 className="text-4xl font-bold">{stats.totalClicks}</h2>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-1">Est. Earnings (Mock)</p>
            <h2 className="text-4xl font-bold text-slate-900">${estimatedEarnings}</h2>
            <p className="text-xs text-slate-400 mt-2">Based on hypothetical 15% conv. @ ${CPA_RATE} CPA</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
             <p className="text-slate-500 text-sm font-medium mb-3">Top Performing Platform</p>
             {Object.entries(stats.byPlatform).sort(([,a], [,b]) => b - a)[0] ? (
               <div>
                 <h2 className="text-2xl font-bold text-slate-900">
                    {Object.entries(stats.byPlatform).sort(([,a], [,b]) => b - a)[0][0]}
                 </h2>
                 <p className="text-brand-600 font-bold text-sm">
                    {Object.entries(stats.byPlatform).sort(([,a], [,b]) => b - a)[0][1]} clicks
                 </p>
               </div>
             ) : (
               <p className="text-slate-400 italic">No data yet</p>
             )}
          </div>
        </div>

        {/* Links Management Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Affiliate Links</h3>
            <p className="text-sm text-slate-500">When AI suggests a platform matching the 'Platform Name', this link is used.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Platform Name (Keyword)</th>
                  <th className="px-6 py-4">Referral URL</th>
                  <th className="px-6 py-4 text-right">Clicks</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {isEditing === link.id ? (
                        <input 
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="border border-slate-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                      ) : link.platformName}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-blue-600 truncate max-w-xs">
                       {isEditing === link.id ? (
                        <input 
                          value={editForm.url}
                          onChange={(e) => setEditForm({...editForm, url: e.target.value})}
                          className="border border-slate-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                      ) : link.url}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {stats.byPlatform[link.platformName] || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing === link.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleSave(link.id)} className="text-green-600 hover:text-green-700 font-bold">Save</button>
                          <button onClick={() => setIsEditing(null)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => handleEdit(link)} className="text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};
