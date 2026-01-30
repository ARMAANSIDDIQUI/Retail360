import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const DataUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setError(null);
            setSuccess(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            });
            setSuccess("Data processed successfully! ML Models updated.");
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="glass p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Upload size={20} className="text-blue-500" />
                    Data Ingestion
                </h3>
                <span className="text-xs text-zinc-500 border border-white/10 px-2 py-1 rounded-full">Max 5 Uploads per User</span>
            </div>

            <p className="text-zinc-400 text-sm mb-6">
                Upload your latest transaction data (.xlsx or .csv) to update the dashboard and ML models.
            </p>

            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-500/10 text-emerald-500 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                        <CheckCircle size={16} /> {success}
                    </motion.div>
                )}
            </AnimatePresence>

            {!file ? (
                <label className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all group">
                    <div className="p-4 bg-zinc-800 rounded-full mb-3 group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-colors">
                        <Upload size={24} />
                    </div>
                    <span className="font-medium text-zinc-300">Click to upload spreadsheet</span>
                    <span className="text-xs text-zinc-500 mt-1">XLSX or CSV (Max 10MB)</span>
                    <input type="file" className="hidden" accept=".csv,.xlsx" onChange={handleFileChange} />
                </label>
            ) : (
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="p-1 hover:bg-white/10 rounded-full text-zinc-400">
                            <X size={16} />
                        </button>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                    >
                        {uploading ? <Loader2 className="animate-spin" size={18} /> : "Process Data"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataUpload;
