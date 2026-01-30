import React from 'react';
import { Settings as SettingsIcon, Database, Server, User } from 'lucide-react';
import DataUpload from '../components/DataUpload';

const Settings = ({ user }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Data Management Column */}
                <div className="space-y-6">
                    <DataUpload />

                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Database size={20} className="text-emerald-500" />
                            Database Status
                        </h3>
                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <span className="text-zinc-400">Type</span>
                            <span className="font-medium">MongoDB (Cloud)</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <span className="text-zinc-400">Status</span>
                            <span className="flex items-center gap-2 text-emerald-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                Online
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-zinc-400">Last Sync</span>
                            <span className="font-medium">Just now</span>
                        </div>
                    </div>
                </div>

                {/* System Settings Column */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Server size={20} className="text-cyan-500" />
                            API Configuration
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Node.js Endpoint</label>
                                <input type="text" value="http://localhost:5000" disabled className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Python ML Service</label>
                                <input type="text" value="http://localhost:5001" disabled className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300" />
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <User size={20} className="text-pink-500" />
                            Profile
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 flex items-center justify-center font-bold text-lg text-white">
                                {user ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <p className="font-bold">{user ? user.name : 'User'}</p>
                                <p className="text-zinc-400 text-sm">{user ? user.email : ''}</p>
                            </div>
                            <button className="ml-auto px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition-colors">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
