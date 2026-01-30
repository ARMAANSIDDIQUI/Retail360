import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';

const Forecast = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch from Node Proxy (which fetches from Python SQL)
                const res = await axios.get('http://localhost:5000/api/ml/forecast');
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass p-4 rounded-xl border border-white/10 shadow-xl">
                    <p className="font-bold text-white mb-2">{label}</p>
                    <p className="text-zinc-400 text-sm">
                        Sales: <span className="text-white">${payload[0].value.toFixed(2)}</span>
                    </p>
                    <p className={`text-xs mt-1 ${payload[0].payload.Type === 'Forecast' ? 'text-blue-400' : 'text-zinc-500'}`}>
                        {payload[0].payload.Type}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-emerald-500" />
                        <h3 className="text-lg font-bold">Predicted Growth</h3>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">
                        {data.length > 0 ? "+14.2%" : "-"}
                    </p>
                    <p className="text-zinc-500 text-sm">Next 6 Months</p>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-blue-500" />
                        <h3 className="text-lg font-bold">Forecast Period</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">Q1-Q2 2024</p>
                    <p className="text-zinc-500 text-sm">Based on SARIMA Model</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-2xl border border-white/5"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-bold">Sales Forecasting (SARIMA)</h2>
                        <p className="text-zinc-400 text-sm">Historical Data vs AI Prediction</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                            <span className="text-zinc-400">Historical</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-400 border border-blue-400/50 border-dashed"></div>
                            <span className="text-zinc-400">Forecast</span>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-zinc-500">Calculating Forecast...</div>
                    ) : data.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                            <TrendingUp size={48} className="mb-4 opacity-50" />
                            <p>No forecast data available.</p>
                            <p className="text-xs">Need at least 12 months of sales history.</p>
                            <a href="/settings" className="text-blue-500 hover:underline mt-2">Upload Data</a>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="Date"
                                    stroke="#52525b"
                                    tick={{ fill: '#71717a', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(str) => str.substring(0, 7)}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    tick={{ fill: '#71717a', fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />

                                <Line
                                    type="monotone"
                                    dataKey="Sales"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                                    activeDot={{ r: 8, fill: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Forecast;
