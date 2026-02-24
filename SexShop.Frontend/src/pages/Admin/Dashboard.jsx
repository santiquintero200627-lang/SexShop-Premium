import React, { useState, useEffect } from 'react';
import productService from '../../api/productService';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        isActive: true
    });

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        } else {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getAll(1, 100);
            setProducts(response.data || []);
        } catch (error) {
            toast.error("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/api/users');
            if (response.data.succeeded) {
                setUsers(response.data.data || []);
            }
        } catch (error) {
            toast.error("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                await apiClient.delete(`/api/users/${id}`);
                toast.success("Usuario eliminado");
                fetchUsers();
            } catch (error) {
                toast.error("Error al eliminar usuario");
            }
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                imageUrl: product.imageUrl || '',
                isActive: product.isActive
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                imageUrl: '',
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                id: editingProduct?.id
            };

            if (editingProduct) {
                await productService.update(editingProduct.id, data);
                toast.success("Producto actualizado");
            } else {
                await productService.create(data);
                toast.success("Producto creado");
            }
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            toast.error("Error al guardar producto");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await productService.delete(id);
                toast.success("Producto eliminado");
                fetchProducts();
            } catch (error) {
                toast.error("Error al eliminar");
            }
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0 text-accent">Panel de Administración</h2>
                <div className="d-flex gap-2">
                    <button
                        className={`btn rounded-pill px-4 ${activeTab === 'products' ? 'btn-accent' : 'btn-outline-dark'}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Productos
                    </button>
                    <button
                        className={`btn rounded-pill px-4 ${activeTab === 'users' ? 'btn-accent' : 'btn-outline-dark'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Usuarios ({users.length})
                    </button>
                </div>
            </div>

            {activeTab === 'products' ? (
                <div className="card-premium bg-white shadow-sm overflow-hidden">
                    <div className="p-4 bg-light border-bottom d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-muted small">LISTADO DE PRODUCTOS</span>
                        <button className="btn btn-accent btn-sm rounded-pill px-3" onClick={() => handleOpenModal()}>
                            + Nuevo Producto
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover m-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Producto</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th className="pe-4 text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && activeTab === 'products' ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i}><td colSpan="5"><div className="skeleton py-3"></div></td></tr>
                                    ))
                                ) : products.map(product => (
                                    <tr key={product.id} className="align-middle">
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center">
                                                <img src={product.imageUrl} className="rounded me-3 border" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                                <span className="fw-medium">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="fw-bold">${product.price.toLocaleString('es-CO')} COP</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${product.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                                {product.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <button className="btn btn-sm btn-outline-dark border-0 rounded-circle me-1" onClick={() => handleOpenModal(product)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger border-0 rounded-circle" onClick={() => handleDelete(product.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card-premium bg-white shadow-sm overflow-hidden">
                    <div className="p-4 bg-light border-bottom d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-muted small">GESTIÓN DE USUARIOS</span>
                        <span className="badge bg-dark rounded-pill px-3 py-2">Total: {users.length}</span>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover m-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Nombre</th>
                                    <th>Email</th>
                                    <th>Fecha de Registro</th>
                                    <th className="pe-4 text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && activeTab === 'users' ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i}><td colSpan="4"><div className="skeleton py-3"></div></td></tr>
                                    ))
                                ) : users.map(user => (
                                    <tr key={user.id} className="align-middle">
                                        <td className="ps-4 fw-medium">{user.firstName} {user.lastName}</td>
                                        <td className="text-muted">{user.email}</td>
                                        <td className="small">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="pe-4 text-end">
                                            <button
                                                className="btn btn-sm btn-outline-danger border-0 rounded-pill px-3"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal de Producto */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="modal d-block"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <motion.div
                                className="modal-content border-0 shadow-lg rounded-4"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                            >
                                <div className="modal-header border-0 p-4">
                                    <h5 className="modal-title fw-bold text-accent">{editingProduct ? 'Editar' : 'Nuevo'} Producto</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body p-4 pt-0">
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-muted">NOMBRE</label>
                                            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-muted">DESCRIPCIÓN</label>
                                            <textarea className="form-control" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3"></textarea>
                                        </div>
                                        <div className="row">
                                            <div className="col-6 mb-3">
                                                <label className="form-label small fw-bold text-muted">PRECIO</label>
                                                <input type="number" step="0.01" className="form-control" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                            </div>
                                            <div className="col-6 mb-3">
                                                <label className="form-label small fw-bold text-muted">STOCK</label>
                                                <input type="number" className="form-control" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-muted">URL DE IMAGEN</label>
                                            <input type="text" className="form-control" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                        </div>
                                        <div className="form-check form-switch mt-3">
                                            <input className="form-check-input" type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                            <label className="form-check-label small fw-bold text-dark">Producto Activo</label>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 p-4 pt-0">
                                        <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-accent rounded-pill px-4">
                                            {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
