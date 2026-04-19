'use client';

import React, { useState, useEffect } from 'react';
import ListingCard from '@/components/ListingCard';
import { useMarket } from '@/contexts/MarketContext';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Package, 
  Users, 
  ShieldAlert, 
  Zap, 
  MessageCircle,
  Clock,
  UserPlus,
  PlusCircle,
  TrendingUp,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function AdminPage() {
  const { currentUser, listings, isLoading: isMarketLoading } = useMarket();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'alerts' | 'logs'>('overview');
  const [adminStats, setAdminStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, logsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/logs')
      ]);
      
      if (statsRes.ok) setAdminStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data');
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    if (!isMarketLoading && (!currentUser || currentUser.role !== 'ADMIN')) {
      router.push('/');
      return;
    }

    if (currentUser?.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [currentUser, isMarketLoading, router]);

  const updateUser = async (id: string, data: any) => {
    try {
      const isDelete = data.delete === true;
      const res = await fetch(`/api/admin/users/${id}`, {
        method: isDelete ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: isDelete ? undefined : JSON.stringify(data)
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Update user error');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Supprimer définitivement cette annonce ?")) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAdminData();
    } catch (err) {
      alert("Erreur serveur.");
    }
  };

  if (isMarketLoading || isStatsLoading || !currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-emerald border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, value, label, color, trend }: any) => (
    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 w-fit mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-black text-gray-900 tracking-tight">{value}</div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{label}</div>
        </div>
        {trend && (
          <div className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">{trend}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      <main className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 flex-grow">
        
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-forest-green text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10">
              <ShieldAlert className="w-7 h-7 text-emerald" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-forest-green tracking-tight font-[family-name:var(--font-playfair)] italic">Super Console</h1>
              <p className="text-[10px] text-emerald/40 font-black uppercase tracking-[0.2em]">Poste de Commandement Elite</p>
            </div>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide">
             {[
               { id: 'overview', label: 'Dashboard', icon: TrendingUp, color: 'emerald' },
               { id: 'members', label: 'Membres', icon: Users, color: 'emerald' },
               { id: 'alerts', label: 'Fraude', icon: ShieldAlert, color: 'red' },
               { id: 'logs', label: 'Audit', icon: Clock, color: 'emerald' }
             ].map((tab: any) => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? `text-forest-green bg-emerald/10 shadow-sm border border-emerald/20` : 'text-slate-400 hover:text-emerald'}`}
               >
                 <tab.icon className="w-3.5 h-3.5" />
                 {tab.label}
               </button>
             ))}
          </div>
        </div>

        {/* --- TAB: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-12">
              <StatCard icon={Users} value={adminStats?.stats?.totalUsers || 0} label="Utilisateurs" color="bg-forest-green" trend="+12%" />
              <StatCard icon={Package} value={adminStats?.stats?.totalListings || 0} label="Annonces" color="bg-emerald" />
              <StatCard icon={Zap} value={adminStats?.stats?.proUsers || 0} label="Membres PRO" color="bg-emerald-light" />
              <StatCard icon={TrendingUp} value={`${adminStats?.stats?.totalRevenue || 0}€`} label="C.A. Total" color="bg-forest-green" />
              <StatCard icon={TrendingUp} value={`${adminStats?.stats?.monthlyRevenue || 0}€`} label="Revenu (30j)" color="bg-emerald" />
              <StatCard icon={CheckCircle} value={`${adminStats?.stats?.conversionRate || 0}%`} label="Conversion" color="bg-emerald-light" />
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-12">
              <div className="flex items-center justify-between mb-8 px-2">
                 <div>
                    <h2 className="text-sm font-black text-forest-green uppercase tracking-widest flex items-center gap-2">
                       <TrendingUp className="w-4 h-4 text-emerald" /> Performances Globales
                    </h2>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-forest-green"></div><span className="text-[9px] font-black uppercase text-slate-400">Membres</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald"></div><span className="text-[9px] font-black uppercase text-slate-400">Revenus</span></div>
                 </div>
              </div>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={adminStats?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14532d" stopOpacity={0.1}/><stop offset="95%" stopColor="#14532d" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.1}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#059669' }} unit="€" />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 700 }} />
                    <Area yAxisId="left" type="monotone" dataKey="users" stroke="#14532d" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                    <Area yAxisId="left" type="monotone" dataKey="listings" stroke="#059669" strokeWidth={4} fillOpacity={1} fill="url(#colorListings)" />
                    <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Clock className="w-4 h-4" /> Activité</h2>
                <div className="space-y-4">
                   {adminStats?.activity?.map((act: any) => (
                     <div key={act.id} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                           {act.avatar ? <img src={act.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-slate-900 truncate"><span className="text-emerald">{act.user}</span> {act.type === 'LISTING' ? 'a posté' : 's\'est inscrit'}</p>
                           <p className="text-[10px] text-slate-400 italic truncate">{act.type === 'LISTING' ? act.title : 'Bienvenue'}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                 <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Package className="w-4 h-4" /> Flux Public</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listings.filter(l => l.status === 'ACTIVE').slice(0, 4).map(listing => (
                      <div key={listing.id} className="bg-white p-4 rounded-3xl border border-gray-50 flex items-center gap-4">
                        <img src={listing.images[0]} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-50" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 truncate text-xs">{listing.title}</h3>
                          <p className="text-[10px] font-black text-glacier uppercase">{listing.price}€</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: MEMBERS --- */}
        {activeTab === 'members' && (
           <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                       <h2 className="text-lg font-black text-gray-900 uppercase">Liste des Membres</h2>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{users.length} comptes</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100">
                       <Search className="w-4 h-4 text-slate-300" />
                       <input type="text" placeholder="Rechercher..." className="text-xs font-bold focus:outline-none w-48" />
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-[#F8F9FD] border-b border-gray-100">
                          <tr>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Membre</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">Rôle</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">PRO</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">Signalement</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {users.map(user => (
                             <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors ${user.isBanned ? 'opacity-50 grayscale bg-red-50/10' : ''}`}>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-4">
                                      <img src={user.avatarUrl || ''} alt="" className="w-10 h-10 rounded-xl border border-slate-100 object-cover" />
                                      <div>
                                         <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                         <p className="text-[10px] font-bold text-slate-400">{user.email}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                   <button onClick={() => updateUser(user.id, { role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' })} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${user.role === 'ADMIN' ? 'bg-forest-green text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>{user.role}</button>
                                </td>
                                <td className="px-8 py-5 text-center">
                                   <button onClick={() => updateUser(user.id, { isPro: !user.isPro })} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${user.isPro ? 'bg-emerald text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>{user.isPro ? '💎 PRO' : 'Classique'}</button>
                                </td>
                                <td className="px-8 py-5 text-center font-black text-xs text-forest-green">{user._count?.listings || 0} ads</td>
                                <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                                   <button onClick={() => updateUser(user.id, { isBanned: !user.isBanned })} className={`p-2.5 rounded-xl transition-all ${user.isBanned ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>{user.isBanned ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}</button>
                                   <button onClick={() => { if(confirm("Supprimer ce compte ?")) updateUser(user.id, { delete: true }) }} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {/* --- TAB: ALERTS --- */}
        {activeTab === 'alerts' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 max-w-3xl mx-auto space-y-6">
              {adminStats?.pendingListings?.map((listing: any) => (
                <div key={listing.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-red-50 shadow-lg flex gap-6 border-l-8 border-l-red-500">
                  <img src={listing.images[0]} alt="" className="w-28 h-28 rounded-3xl object-cover border border-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-forest-green text-base leading-tight truncate mb-2">{listing.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                       {listing.details?.moderationReasons?.map((reason: string, idx: number) => (
                         <span key={idx} className="text-[9px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">⚠️ {reason}</span>
                       ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={async () => { const res = await fetch(`/api/listings/${listing.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'ACTIVE' }), headers: { 'Content-Type': 'application/json' } }); if (res.ok) fetchAdminData(); }} className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase shadow-md transition hover:bg-emerald-700">Valider l'annonce</button>
                      <button onClick={() => handleDeleteListing(listing.id)} className="px-6 py-3 rounded-2xl bg-red-50 text-red-500 font-bold text-[10px] uppercase transition hover:bg-red-500 hover:text-white">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
              {(!adminStats?.pendingListings || adminStats.pendingListings.length === 0) && (
                <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
                   <CheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
                   <p className="text-sm font-black text-slate-400 italic">Aucune alerte fraude en attente.</p>
                </div>
              )}
           </div>
        )}

        {/* --- TAB: LOGS --- */}
        {activeTab === 'logs' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 max-w-4xl mx-auto">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-6">
                 <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8"><Clock className="w-4 h-4" /> Historique d'Audit</h2>
                 <div className="space-y-2">
                    {logs.map((log: any) => (
                      <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                         <div className="w-10 h-10 bg-emerald/10 text-emerald rounded-xl flex items-center justify-center font-black text-xs">{log.admin?.name?.substring(0,2).toUpperCase()}</div>
                         <div className="flex-1">
                            <p className="text-xs font-bold text-forest-green"><span className="text-emerald">{log.admin?.name}</span> • {log.action}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">{log.details}</p>
                         </div>
                         <div className="text-[10px] font-black text-slate-300 uppercase shrink-0">{new Date(log.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                    {logs.length === 0 && <p className="text-center py-20 text-slate-400 font-bold italic text-sm">Aucun log enregistré pour le moment.</p>}
                 </div>
              </div>
           </div>
        )}

      </main>
    </div>
  );
}
