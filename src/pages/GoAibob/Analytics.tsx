/**
 * Analytics.tsx - Premium Analytics Dashboard
 * Features: Particle Background, Glassmorphism, Neon Charts
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from '../../components/ParticleBackground';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

interface AnalyticsData {
  categories: Array<{ name: string; value: number }>;
  spamScoreDistribution: Array<{ name: string; value: number }>;
  backlinkValueDistribution: Record<string, number>;
  topDomains: Array<{ url: string; value: number; email_count: number }>;
  timelineData: Array<{ date: string; count: number }>;
  totalRevenue: number;
  avgBacklinkValue: number;
  totalSites: number;
  totalEmails: number;
}

const API_BASE = import.meta.env.VITE_GOB_API_URL || 'https://us-central1-gentleomegaai.cloudfunctions.net/gobApi';

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    // Simulate API fetch delay for smooth animation
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // const res = await fetch(`${API_BASE}/api/gob/stats?days=${dateRange}`);
        // if (!res.ok) throw new Error('Failed to fetch analytics');
        // const statsData = await res.json();

        // Using mock data for high-end demo purposes
        setTimeout(() => {
          setData(transformData({}));
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const transformData = (raw: any): AnalyticsData => {
    return {
      categories: [
        { name: 'Tech', value: 324 },
        { name: 'Biz', value: 287 },
        { name: 'Mktg', value: 256 },
        { name: 'Fin', value: 198 },
        { name: 'Ecom', value: 142 }
      ],
      spamScoreDistribution: [
        { name: '0-20', value: 450 },
        { name: '20-40', value: 380 },
        { name: '40-60', value: 220 },
        { name: '60-80', value: 85 },
        { name: '80-100', value: 12 }
      ],
      backlinkValueDistribution: {
        '$20-50': 280,
        '$50-100': 320,
        '$100-200': 220,
        '$200-500': 145,
        '$500+': 42
      },
      topDomains: [
        { url: 'techcrunch.com', value: 850, email_count: 12 },
        { url: 'forbes.com', value: 720, email_count: 8 },
        { url: 'medium.com', value: 580, email_count: 15 },
        { url: 'linkedin.com', value: 450, email_count: 6 },
        { url: 'producthunt.com', value: 380, email_count: 10 }
      ],
      timelineData: [
        { date: 'Nov 15', count: 120 },
        { date: 'Nov 16', count: 185 },
        { date: 'Nov 17', count: 142 },
        { date: 'Nov 18', count: 198 },
        { date: 'Nov 19', count: 176 },
        { date: 'Nov 20', count: 224 },
        { date: 'Nov 21', count: 189 }
      ],
      totalRevenue: 24500,
      avgBacklinkValue: 145.75,
      totalSites: 1207,
      totalEmails: 3420
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center relative overflow-hidden">
        <ParticleBackground color="#06b6d4" count={30} />
        <div className="text-center z-10">
          <div className="animate-spin text-6xl mb-4 text-cyan-500">◈</div>
          <p className="text-cyan-400 font-mono tracking-widest animate-pulse">ANALYZING DATA STREAMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden font-sans">
      <ParticleBackground className="opacity-40" count={60} color="#0e7490" />

      {/* Decorative Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto p-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2">
              Analytics Hub
            </h1>
            <p className="text-gray-400 text-lg">Real-time intelligence tracking & revenue metrics</p>
          </div>

          <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1">
            {['7', '30', '90'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${dateRange === range
                    ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {range} Days
              </button>
            ))}
          </div>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KpiCard title="Total Sites Indexed" value={data!.totalSites} icon="🌐" color="cyan" delay={0} />
          <KpiCard title="Verified Emails" value={data!.totalEmails} icon="✉️" color="emerald" delay={0.1} />
          <KpiCard title="Avg Link Value" value={`$${data!.avgBacklinkValue}`} icon="💎" color="purple" delay={0.2} />
          <KpiCard title="Projected Revenue" value={`$${data!.totalRevenue.toLocaleString()}`} icon="🚀" color="amber" delay={0.3} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Main Timeline Chart */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-cyan-500 rounded-full" /> Acquisition Velocity
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data!.timelineData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#22d3ee' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-purple-500 rounded-full" /> Niche Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data!.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data!.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {data!.categories.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-sm text-gray-400">{cat.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Sites Table (Glass Table) */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-emerald-500 rounded-full" /> High-Value Assets
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 text-gray-400 font-medium">Domain</th>
                    <th className="py-3 text-gray-400 font-medium">Link Value</th>
                    <th className="py-3 text-gray-400 font-medium">Emails</th>
                  </tr>
                </thead>
                <tbody>
                  {data!.topDomains.map((domain, idx) => (
                    <tr key={idx} className="group border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-cyan-300 font-medium group-hover:text-cyan-200">{domain.url}</td>
                      <td className="py-4 text-emerald-400 font-bold">${domain.value}</td>
                      <td className="py-4 text-gray-300">{domain.email_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable KPI Card Component
const KpiCard: React.FC<{ title: string; value: string | number; icon: string; color: string; delay: number }> = ({
  title, value, icon, color, delay
}) => {
  const colorMap: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-900/10 border-purple-500/30 text-purple-400',
    amber: 'from-amber-500/20 to-amber-900/10 border-amber-500/30 text-amber-400',
  };

  const style = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-gradient-to-br ${style} backdrop-blur-md border rounded-2xl p-6 shadow-lg relative overflow-hidden group`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform scale-150">
        <span className="text-6xl">{icon}</span>
      </div>

      <p className="text-gray-300 text-sm font-medium tracking-wide uppercase mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>

      <div className="w-full bg-black/20 h-1 rounded-full mt-4 overflow-hidden">
        <motion.div
          className="h-full bg-current opacity-50"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, delay: delay + 0.5, ease: "circOut" }}
        />
      </div>
    </motion.div>
  );
};

export default Analytics;
