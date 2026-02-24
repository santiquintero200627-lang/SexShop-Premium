import React, { useState, useEffect } from 'react';
import productService from '../api/productService';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Home = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getAll();
                setProducts(response.data || []);
            } catch (error) {
                console.error("Error loading products", error);
                toast.error("No se pudieron cargar los productos");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const ProductSkeleton = () => (
        <div className="col-12 col-md-4 col-lg-3">
            <div className="card-premium h-100" style={{ minHeight: '400px' }}>
                <div className="skeleton" style={{ height: '280px', borderRadius: '24px 24px 0 0' }}></div>
                <div className="p-4">
                    <div className="skeleton mb-2" style={{ height: '25px', width: '70%' }}></div>
                    <div className="skeleton mb-3" style={{ height: '15px', width: '100%' }}></div>
                    <div className="d-flex justify-content-between">
                        <div className="skeleton" style={{ height: '30px', width: '40%' }}></div>
                        <div className="skeleton" style={{ height: '45px', width: '45px', borderRadius: '50%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container py-5 mt-4 mt-lg-0">
            {/* Hero Section */}
            <motion.div
                className="row mb-5 py-5 text-center fade-in"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="col-lg-8 mx-auto">
                    <h1 className="display-3 fw-bold mb-4">SexShop Premium</h1>
                    <p className="lead text-muted fs-4">Calidad y discreción en cada detalle.</p>
                </div>
            </motion.div>

            {/* Catalog Grid */}
            <div className="row g-4">
                {loading ? (
                    Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                ) : products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} className="col-12 col-md-4 col-lg-3">
                            <ProductCard product={product} addToCart={addToCart} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <i className="bi bi-box-seam display-1 text-muted"></i>
                        <h3 className="mt-3">Aún no hay productos disponibles</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
