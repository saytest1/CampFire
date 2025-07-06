import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_CATEGORIES, DELETE_CATEGORY } from '../../graphql/categories';
import CreateCategoryModal from './CreateCategoryModal';

export default function Categories() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categoriesData, loading: categoriesLoading, refetch } = useQuery(GET_ALL_CATEGORIES);

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      refetch();
    }
  });

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory({
          variables: {
            input: { _id: categoryId }
          }
        });
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const filteredCategories = categoriesData?.categories?.nodes?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Add New Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div key={category._id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">ID: {category._id}</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No categories found.</p>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
} 