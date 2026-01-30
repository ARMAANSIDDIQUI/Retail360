import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Users, AlertCircle } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

const Customers = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch from Node Proxy (which fetches from Python SQL)
                const res = await axios.get('http://localhost:5000/api/ml/segmentation');
                if (res.data && res.data.length > 0) {
                    setData(res.data);
                } else {
                    setData([]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch", err);
                setData([]);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass p-4 rounded-xl border border-white/10 shadow-xl">
                    <p className="font-bold text-white mb-2">Customer Details</p>
                    <p className="text-zinc-400 text-sm">Income: <span className="text-white">${payload[0].value}k</span></p>
                    <p className="text-zinc-400 text-sm">Score: <span className="text-white">{payload[1].value}</span></p>
                    <p className="text-zinc-400 text-sm mt-2 text-xs">Cluster: {payload[0].payload.Cluster}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/20 text-cyan-500 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-zinc-400 text-sm">Total Customers</p>
                        <h3 className="text-2xl font-bold">{data.length > 0 ? data.length.toLocaleString() : '-'}</h3>
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-2xl border border-white/5"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Customer Segmentation (K-Means)</h2>
                        <p className="text-zinc-400 text-sm">Clustering based on Annual Income vs Spending Score</p>
                    </div>
                </div>

                <div className="h-[500px] w-full">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-zinc-500">
                            Loading ML Models...
                        </div>
                    ) : data.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                            <AlertCircle size={48} className="mb-4 opacity-50" />
                            <p>No customer data found.</p>
                            <a href="/settings" className="text-blue-500 hover:underline mt-2">Upload Data in Settings</a>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                <XAxis
                                    type="number"
                                    dataKey="AnnualIncome"
                                    name="Annual Income"
                                    unit="k"
                                    stroke="#52525b"
                                    tick={{ fill: '#71717a' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="SpendingScore"
                                    name="Spending Score"
                                    unit=""
                                    stroke="#52525b"
                                    tick={{ fill: '#71717a' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Customers" data={data} fill="#8884d8">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.Cluster % COLORS.length]} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Customers;
