import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_PRODUCTS, DELETE_PRODUCT, GET_PRODUCT_BY_ID } from '../../graphql/products';
import { GET_ALL_CATEGORIES } from '../../graphql/categories';
import { GET_ALL_MANUFACTURERS } from '../../graphql/manufacturers';
import { Link, useNavigate } from 'react-router-dom';
import CreateProductModal from './CreateProductModal';

export default function Products() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
    // Optionally validate token with a backend request here
  }, [navigate, token]);

  const { data: productsData, loading: productsLoading, refetch } = useQuery(GET_ALL_PRODUCTS, {
    variables: { first: 1000, offset: 0 }
  });

  const { data: categoriesData } = useQuery(GET_ALL_CATEGORIES);
  const { data: manufacturersData } = useQuery(GET_ALL_MANUFACTURERS);

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      refetch();
    }
  });

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct({ variables: { _id: productId } });
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = productsData?.products?.nodes?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categoriesData?.categories?.nodes?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manufacturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover mr-3" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.categoryName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.manufacturerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateProductModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            refetch();
          }}
          categories={categoriesData?.categories?.nodes || []}
          manufacturers={manufacturersData?.manufacturers?.nodes || []}
        />
      )}
    </div>
  );
} 