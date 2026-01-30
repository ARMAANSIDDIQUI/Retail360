import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, Settings as SettingsIcon, Activity, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import Customers from './pages/Customers';
import Forecast from './pages/Forecast';
import Settings from './pages/Settings';
import Login from './pages/Login';

const Dashboard = () => {
    const [stats, setStats] = useState({ total_revenue: 0, total_customers: 0, status: 'Loading...' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/ml/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setStats({ total_revenue: 0, total_customers: 0, status: 'Offline' });
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Total Revenue',
                        value: loading ? '...' : `$${stats.total_revenue.toLocaleString()}`,
                        trend: 'Live',
                        icon: Activity,
                        color: 'text-blue-500'
                    },
                    {
                        title: 'Active Customers',
                        value: loading ? '...' : stats.total_customers.toLocaleString(),
                        trend: 'Live',
                        icon: Users,
                        color: 'text-violet-500'
                    },
                    {
                        title: 'System Status',
                        value: stats.status,
                        trend: 'Check Settings',
                        icon: TrendingUp,
                        color: 'text-emerald-500'
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-6 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={60} />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-zinc-400 text-sm font-medium">{stat.title}</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                            <span className="text-emerald-400 text-sm mb-1">{stat.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-6 rounded-2xl"
                >
                    <h3 className="text-lg font-bold mb-4">Data Feed</h3>
                    {stats.total_revenue === 0 ? (
                        <div className="text-center py-10 text-zinc-500">
                            <p>No data found.</p>
                            <Link to="/settings" className="text-blue-400 hover:underline">Go to Settings to Upload Data</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <p className="text-sm text-zinc-300">Data Source Connected: SQLite</p>
                                <span className="ml-auto text-xs text-zinc-500">Live</span>
                            </div>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-6 rounded-2xl flex flex-col justify-center items-center text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mb-4">
                        <Activity size={32} />
                    </div>
                    <h3 className="text-lg font-bold">ML Engine Ready</h3>
                    <p className="text-zinc-400 text-sm mt-2">
                        {stats.total_revenue > 0 ? "Models are trained on current data." : "Waiting for data upload to train models."}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link to={path}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-primary/20 text-primary border border-primary/20' : 'hover:bg-white/5 text-zinc-400 hover:text-white'}`}>
            <Icon size={20} className={active ? 'text-primary' : 'group-hover:text-white'} />
            <span className="font-medium">{label}</span>
            {active && <motion.div layoutId="active-pill" className="w-1 h-6 bg-primary absolute left-0 rounded-r-full" />}
        </div>
    </Link>
);

const App = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('retail360_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setCheckingAuth(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('retail360_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('retail360_user');
    };

    if (checkingAuth) {
        return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
    }

    // Force Login Redirect
    if (!user) {
        if (location.pathname === '/login') {
            return <Login onLogin={handleLogin} />;
        }
        return <Navigate to="/login" replace />;
    }

    // If logged in and at /login, go to home
    if (user && location.pathname === '/login') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen bg-background text-white selection:bg-primary/30">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="fixed left-0 top-0 h-full glass border-r border-white/5 z-50 hidden md:block"
            >
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"
                            >
                                Retail360
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        {isSidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
                        { icon: Users, label: 'Customers', path: '/customers' },
                        { icon: TrendingUp, label: 'Forecast', path: '/forecast' },
                        { icon: SettingsIcon, label: 'Settings', path: '/settings' },
                    ].map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                            label={isSidebarOpen ? item.label : ''}
                        />
                    ))}
                </nav>

                {/* User Profile / Logout */}
                <div className="absolute bottom-6 left-0 w-full px-4">
                    <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center font-bold text-xs shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate">{user.name}</p>
                                <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">Log Out</button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className={`flex-1 h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'} p-8`}>
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {location.pathname === '/' ? 'Overview' : location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.slice(2)}
                        </h1>
                        <p className="text-zinc-400 mt-1">Real-time business intelligence insights</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/forecast" element={<Forecast />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
