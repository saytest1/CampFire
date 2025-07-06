import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CATEGORY } from '../../graphql/categories';

export default function CreateCategoryModal({ isOpen, onClose, onSuccess }) {
  const [categoryName, setCategoryName] = useState('');

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      onSuccess();
      setCategoryName('');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory({
        variables: {
          input: {
            name: categoryName
          }
        }
      });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Category'}
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