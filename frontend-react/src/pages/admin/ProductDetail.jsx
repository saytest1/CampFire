import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT_BY_ID, UPDATE_PRODUCT } from '../../graphql/products';
import { GET_ALL_CATEGORIES } from '../../graphql/categories';
import { GET_ALL_MANUFACTURERS } from '../../graphql/manufacturers';
import { UPLOAD_MUTATION } from '../../graphql/upload';

export default function ProductDetail() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
    // Optionally validate token with a backend request here
  }, [navigate, token]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: productData, loading: productLoading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { _id }
  });
  console.log("ProductDetail: query variables =", { _id });
  console.log("ProductDetail: loading =", productLoading, "error =", error, "data =", productData);

  const { data: categoriesData } = useQuery(GET_ALL_CATEGORIES);
  const { data: manufacturersData } = useQuery(GET_ALL_MANUFACTURERS);

  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [uploadFile] = useMutation(UPLOAD_MUTATION);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    manufacturerId: '',
    description: ''
  });

  React.useEffect(() => {
    if (productData?.product) {
      const product = productData.product;
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        categoryId: product.categoryId || '',
        manufacturerId: product.manufacturerId || '',
        description: product.description || ''
      });
    }
  }, [productData]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadProgress(0);
      const result = await uploadFile({
        variables: { file: selectedFile }
      });

      if (result.data?.upload) {
        await updateProduct({
          variables: {
            _id,
            input: {
              ...formData,
              price: parseFloat(formData.price),
              imageUrl: result.data.upload
            }
          }
        });
        setSelectedFile(null);
        setUploadProgress(100);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateProduct({
        variables: {
          _id,
          input: {
            ...formData,
            price: parseFloat(formData.price)
          }
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const product = productData?.product;

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/products"
            className="text-blue-600 hover:text-blue-900"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Cancel Edit' : 'Edit Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Product Information</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                >
                  {categoriesData?.categories?.nodes?.map((category) => (
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
                >
                  {manufacturersData?.manufacturers?.nodes?.map((manufacturer) => (
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

              <button
                onClick={handleSave}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Name</span>
                <p className="text-lg text-gray-900">{product.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Price</span>
                <p className="text-lg text-gray-900">${product.price}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Category</span>
                <p className="text-lg text-gray-900">{product.categoryName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Manufacturer</span>
                <p className="text-lg text-gray-900">{product.manufacturerName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Description</span>
                <p className="text-lg text-gray-900">{product.description || 'No description available'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Product Image</h2>
          
          <div className="space-y-4">
            {product.imageUrl ? (
              <div>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Image
                </button>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
   );
} 