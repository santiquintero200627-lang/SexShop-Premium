import apiClient from './apiClient';

const productService = {
    getAll: async (page = 1, pageSize = 100) => {
        const response = await apiClient.get(`/api/products?page=${page}&pageSize=${pageSize}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/api/products/${id}`);
        return response.data;
    },

    create: async (productData) => {
        const response = await apiClient.post('/api/products', productData);
        return response.data;
    },

    update: async (id, productData) => {
        const response = await apiClient.put(`/api/products/${id}`, productData);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/api/products/${id}`);
        return response.data;
    }
};

export default productService;
