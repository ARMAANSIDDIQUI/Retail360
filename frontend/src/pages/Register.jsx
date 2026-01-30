import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = ({ onLogin }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Registration failed');

            onLogin(data.user);
            localStorage.setItem('token', data.token); // Save JWT
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass w-full max-w-md p-8 rounded-2xl relative z-10 border border-white/10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                        <UserPlus size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Create Account</h2>
                    <p className="text-zinc-500 mt-2">Join Retail360 today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-3 top-3 text-zinc-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-3 top-3 text-zinc-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 text-zinc-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-zinc-500 mt-6 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-secondary transition-colors font-medium">
                        Log In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
