'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import ProductFormModal from './ProductFormModal';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user, token, products, setProducts } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Protected Route Logic
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        // อัปเดต State โดยกรองตัวที่ถูกลบออก
        setProducts((prev: Product[]) => prev.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">⚙️ Admin Dashboard (Manage Menu)</h1>
        <button
          onClick={handleAddNew}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow"
        >
          + Add New Menu
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Menu Name</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                </td>
                <td className="p-4 font-semibold text-foreground">{product.name}</td>
                <td className="p-4 text-gray-600">{product.categoryName || 'Unknown'}</td>
                <td className="p-4 text-gray-600">${product.price.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 font-semibold text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No products found. Click &quot;Add New Menu&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        productToEdit={editingProduct}
      />
    </div>
  );
}
