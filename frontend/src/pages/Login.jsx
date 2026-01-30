import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleDemoLogin = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/ml/seed');
            onLogin({ name: 'Armaan Siddiqui', email: 'demo@retail360.com' });
            navigate('/');
        } catch (error) {
            console.error("Login failed", error);
            alert("Demo Server Error. Check if Python/Node backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ name: 'User', email });
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/20 blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-md p-8 rounded-3xl relative z-10 border border-white/10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">Retail360</h1>
                    <p className="text-zinc-400">Next-Gen Business Intelligence</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors text-white placeholder:text-zinc-600"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors text-white placeholder:text-zinc-600"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors">
                        Sign In
                    </button>
                </form>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-zinc-800"></div>
                    <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs uppercase tracking-wider">Or</span>
                    <div className="flex-grow border-t border-zinc-800"></div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleDemoLogin}
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="text-yellow-300" />}
                        {loading ? "Setting up Demo..." : "Demo Login"}
                        {!loading && <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-normal text-blue-200 ml-1">(Armaan Siddiqui)</span>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
