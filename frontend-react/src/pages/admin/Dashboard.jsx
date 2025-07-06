import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS } from '../../graphql/products';
import { GET_ALL_CATEGORIES } from '../../graphql/categories';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NavigationBar from './NavigationBar';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0
  });

  const { data: productsData, loading: productsLoading } = useQuery(GET_ALL_PRODUCTS, {
    variables: { first: 1000, offset: 0 }
  });

  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_ALL_CATEGORIES);

  useEffect(() => {
    if (productsData?.products?.nodes) {
      setStats(prev => ({
        ...prev,
        totalProducts: productsData.products.nodes.length,
        totalRevenue: productsData.products.nodes.reduce((sum, product) => sum + (product.price || 0), 0)
      }));
    }
  }, [productsData]);

  useEffect(() => {
    if (categoriesData?.categories?.nodes) {
      setStats(prev => ({
        ...prev,
        totalCategories: categoriesData.categories.nodes.length
      }));
    }
  }, [categoriesData]);

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationBar />
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link to="/admin/products">Manage Products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/categories">Manage Categories</Link>
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold text-blue-700">{stats.totalProducts}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold text-green-700">{stats.totalCategories}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold text-yellow-700">${stats.totalRevenue.toLocaleString()}</span>
            </CardContent>
          </Card>
        </div>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200">
                {productsData?.products?.nodes?.slice(0, 5).map((product) => (
                  <li key={product._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400">📦</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.categoryName}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">${product.price}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200">
                {categoriesData?.categories?.nodes?.slice(0, 5).map((category) => (
                  <li key={category._id} className="flex items-center justify-between py-3">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className="text-sm text-gray-500">
                      {productsData?.products?.nodes?.filter(p => p.categoryId === category._id).length} products
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
