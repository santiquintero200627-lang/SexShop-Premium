import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Las contraseñas no coinciden');
        }
        setLoading(true);
        try {
            const response = await apiClient.post('/api/auth/register', formData);
            if (response.data.succeeded) {
                toast.success('Cuenta creada. ¡Ya puedes iniciar sesión!');
                navigate('/login');
            } else {
                toast.error(response.data.message || 'Error al registrarse');
            }
        } catch (error) {
            toast.error('Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <motion.div
                className="card-premium p-4 p-md-5 bg-white shadow-sm"
                style={{ maxWidth: '450px', width: '100%' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-accent">Registrarse</h2>
                    <p className="text-muted small">Crea tu cuenta en SexShop Premium</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-6 mb-3">
                            <label className="form-label small text-muted">NOMBRE</label>
                            <input type="text" className="form-control" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
                        </div>
                        <div className="col-6 mb-3">
                            <label className="form-label small text-muted">APELLIDO</label>
                            <input type="text" className="form-control" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label small text-muted">CORREO ELECTRÓNICO</label>
                        <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small text-muted">CONTRASEÑA</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small text-muted">CONFIRMAR CONTRASEÑA</label>
                        <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-accent w-100 rounded-pill py-3 fw-bold" disabled={loading}>
                        {loading ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="text-center mt-4 pt-2 border-top">
                    <p className="small text-muted mb-0">¿Ya tienes cuenta? <Link to="/login" className="text-accent fw-bold text-decoration-none">Entra aquí</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
