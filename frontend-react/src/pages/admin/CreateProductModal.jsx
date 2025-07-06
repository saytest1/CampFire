import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT } from '../../graphql/products';

export default function CreateProductModal({ isOpen, onClose, onSuccess, categories, manufacturers }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    manufacturerId: '',
    description: ''
  });

  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      onSuccess();
      setFormData({
        name: '',
        price: '',
        categoryId: '',
        manufacturerId: '',
        description: ''
      });
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        variables: {
          input: {
            name: formData.name,
            price: parseFloat(formData.price),
            categoryId: formData.categoryId,
            manufacturerId: formData.manufacturerId,
            description: formData.description
          }
        }
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manufacturer
            </label>
            <select
              value={formData.manufacturerId}
              onChange={(e) => setFormData({ ...formData, manufacturerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Manufacturer</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer._id} value={manufacturer._id}>
                  {manufacturer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 