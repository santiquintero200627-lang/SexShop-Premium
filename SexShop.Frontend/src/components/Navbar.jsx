import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../api/authService';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user, logout, cart, updateQuantity, removeFromCart }) => {
    const isAdmin = authService.isAdmin();
    const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    return (
        <>
            <nav className="navbar navbar-expand-lg glass navbar-light sticky-top py-3 px-4 shadow-sm">
                <div className="container-fluid">
                    <Link className="navbar-brand fs-4" to="/">SexShop <span className="text-muted fw-light">Premium</span></Link>

                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 align-items-center">
                            {!isAdmin && (
                                <>
                                    <li className="nav-item"><Link className="nav-link fw-medium" to="/">Productos</Link></li>
                                </>
                            )}
                            {user && (
                                <li className="nav-item ms-lg-3">
                                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-normal">
                                        <i className="bi bi-person-check me-2 text-accent"></i>
                                        Hola, <span className="fw-bold">{isAdmin ? 'Administrador' : (user.firstName || 'Usuario')}</span>
                                    </span>
                                </li>
                            )}
                        </ul>

                        <div className="d-flex align-items-center gap-4">
                            {!isAdmin && (
                                <button
                                    className="btn btn-link position-relative border-0 p-0 text-accent"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#cartDrawer"
                                >
                                    <i className="bi bi-bag-fill fs-4"></i>
                                    {totalItems > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                            )}

                            {user ? (
                                <div className="dropdown">
                                    <button className="btn btn-outline-dark rounded-pill px-4 dropdown-toggle btn-sm" data-bs-toggle="dropdown">
                                        Cuenta
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-3 p-2">
                                        <li className="p-3 border-bottom mb-2">
                                            <div className="fw-bold small">{user.name || user.Email}</div>
                                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>Miembro Premium</div>
                                        </li>
                                        <li><button className="dropdown-item rounded py-2" onClick={logout}><i className="bi bi-box-arrow-right me-2"></i> Salir</button></li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="d-flex gap-2">
                                    <Link className="btn btn-link text-decoration-none text-accent fw-bold btn-sm" to="/login">Entrar</Link>
                                    <Link className="btn btn-accent rounded-pill px-4 btn-sm" to="/register">Crear Cuenta</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Cart Drawer (Offcanvas) */}
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartDrawer" aria-labelledby="cartDrawerLabel">
                <div className="offcanvas-header border-bottom p-4">
                    <h5 className="offcanvas-title fw-bold" id="cartDrawerLabel">Tu Carrito</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-4 d-flex flex-column">
                    {cart.length === 0 ? (
                        <div className="text-center py-5 mt-5">
                            <i className="bi bi-cart-x fs-1 text-muted"></i>
                            <p className="mt-3 text-muted">El carrito está vacío</p>
                            <Link to="/" className="btn btn-accent rounded-pill mt-3" data-bs-dismiss="offcanvas">Seguir comprando</Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex-grow-1">
                                {cart.map(item => (
                                    <div key={item.id} className="d-flex gap-3 mb-4 pb-4 border-bottom align-items-center">
                                        <img src={item.imageUrl} alt={item.name} className="rounded" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-bold">{item.name}</h6>
                                            <span className="text-muted small">${item.price.toLocaleString('es-CO')} COP x {item.quantity}</span>
                                            <div className="d-flex align-items-center gap-2 mt-2">
                                                <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                                <span className="small fw-bold px-1">{item.quantity}</span>
                                                <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                                <button className="btn btn-link btn-sm text-danger ms-auto p-0" onClick={() => removeFromCart(item.id)}><i className="bi bi-trash"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 mt-auto border-top">
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fs-5 fw-light">Total</span>
                                    <span className="fs-5 fw-bold text-accent">${totalPrice.toLocaleString('es-CO')} COP</span>
                                </div>
                                <button className="btn btn-accent w-100 rounded-pill py-3 fw-bold mb-2">Pagar Ahora</button>
                                <p className="text-center text-muted m-0" style={{ fontSize: '0.7rem' }}>Pago seguro y discreto 🔐</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
