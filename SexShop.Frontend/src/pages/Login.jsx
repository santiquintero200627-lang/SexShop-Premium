import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userData = await authService.login(email, password);
            setUser(userData);
            toast.success('¡Bienvenido de nuevo!');
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <motion.div
                className="card-premium p-4 p-md-5 glass"
                style={{ maxWidth: '450px', width: '100%' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-accent">SexShop Premium</h2>
                    <p className="text-muted">Accede a tu cuenta premium</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label small text-muted">CORREO ELECTRÓNICO</label>
                        <input
                            type="email"
                            className="form-control bg-dark border-secondary text-white rounded-pill px-4"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small text-muted">CONTRASEÑA</label>
                        <input
                            type="password"
                            className="form-control bg-dark border-secondary text-white rounded-pill px-4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-accent w-100 rounded-pill py-3 fw-bold"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
