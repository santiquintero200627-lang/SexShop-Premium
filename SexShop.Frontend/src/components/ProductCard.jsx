import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, addToCart }) => {
    return (
        <motion.div
            className="card-premium h-100 d-flex flex-column"
            whileHover={{ y: -10 }}
        >
            <div className="position-relative overflow-hidden" style={{ height: '280px' }}>
                <img
                    src={product.imageUrl
                        ? (product.imageUrl.startsWith('http') ? product.imageUrl : `https://via.placeholder.com/${product.imageUrl}`)
                        : 'https://via.placeholder.com/300x400?text=SexShop'}
                    alt={product.name}
                    className="w-100 h-100 object-fit-cover transition-transform"
                    loading="lazy"
                />
                <div className="position-absolute bottom-0 start-0 p-3 w-100 bg-gradient-dark">
                    <span className="badge bg-accent rounded-pill">Premium</span>
                </div>
            </div>

            <div className="p-4 flex-grow-1 d-flex flex-column">
                <h5 className="fw-bold mb-2 text-accent">{product.name}</h5>
                <p className="text-muted small mb-3 flex-grow-1">{product.description}</p>

                <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fs-4 fw-bold text-accent">${product.price.toLocaleString('es-CO')} COP</span>
                    {addToCart && (
                        <button
                            className="btn btn-accent rounded-circle p-2 d-flex align-items-center justify-content-center"
                            onClick={() => addToCart(product)}
                            style={{ width: '45px', height: '45px' }}
                        >
                            <i className="bi bi-cart-plus fs-5"></i>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
