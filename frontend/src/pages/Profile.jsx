import React, { useState, useEffect } from 'react';
import { User, Lock, Upload, Trash2, AlertCircle } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [uploads, setUploads] = useState([]); // This would come from user data typically
    const [passData, setPassData] = useState({ currentPassword: '', newPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                setUploads(data.uploads || []);
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(passData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg);
            setMessage('Password updated successfully');
            setPassData({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUpload = async (uploadId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/auth/upload/${uploadId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                fetchProfile(); // Refresh list
            }
        } catch (err) {
            console.error('Failed to delete upload', err);
        }
    };

    if (!user) return <div className="p-8 text-center">Loading Profile...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">User Profile</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Info & Change Password */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <User size={20} className="text-primary" />
                            Account Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-400 block mb-1">Full Name</label>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-zinc-300">
                                    {user.name}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 block mb-1">Email Address</label>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-zinc-300">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Lock size={20} className="text-secondary" />
                            Change Password
                        </h3>
                        {message && <p className="text-emerald-400 text-sm mb-3">{message}</p>}
                        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={passData.currentPassword}
                                onChange={e => setPassData({ ...passData, currentPassword: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:outline-none"
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={passData.newPassword}
                                onChange={e => setPassData({ ...passData, newPassword: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:outline-none"
                            />
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors">
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>

                {/* Uploads List */}
                <div className="glass p-6 rounded-2xl h-fit">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Upload size={20} className="text-accent" />
                        Upload History
                    </h3>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6 flex gap-3 text-sm text-blue-200">
                        <AlertCircle size={20} className="shrink-0" />
                        <p>Limit: 5 Uploads. Oldest uploads are automatically deleted when limit is reached.</p>
                    </div>

                    {uploads.length === 0 ? (
                        <p className="text-center text-zinc-500 py-8">No uploads found.</p>
                    ) : (
                        <div className="space-y-3">
                            {uploads.map((upload, index) => (
                                <div key={upload._id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/20 transition-colors">
                                    <div className="overflow-hidden">
                                        <p className="font-medium truncate text-sm">{upload.filename}</p>
                                        <p className="text-xs text-zinc-500">{new Date(upload.date).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteUpload(upload._id)}
                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Upload"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
