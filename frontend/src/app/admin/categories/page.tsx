'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const { token } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await res.json();
      if (data.status === 'success') {
        setCategories(data.data);
      } else {
        toast.error('Failed to load categories');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error while fetching categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAddModal = () => {
    setEditCategory(null);
    setName('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditCategory(category);
    // Wrap inside setTimeout to avoid state-setting warning during render conflicts if any
    setTimeout(() => {
      setName(category.name);
      setIsModalOpen(true);
    }, 0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName('');
    setEditCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Session expired. Please login again.');
      return;
    }

    setIsSaving(true);
    try {
      const url = editCategory
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${editCategory.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`;
      const method = editCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        toast.success(data.message || 'Category saved successfully!');
        closeModal();
        fetchCategories();
      } else {
        toast.error(data.message || 'Failed to save category');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error while saving category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    if (!token) {
      toast.error('Session expired.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (res.ok && data.status === 'success') {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        toast.error(data.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error while deleting category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories Management</h1>
          <p className="text-gray-500 mt-1">Organize your product categories</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#c73b0f] hover:bg-[#a6300a] text-white px-5 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Slug</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#c73b0f] border-t-transparent rounded-full animate-spin" />
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No categories found. Click &quot;Add Category&quot; to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{cat.id}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">{cat.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-mono">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-foreground">
                {editCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c73b0f] transition-all"
                  placeholder="e.g. Desserts, Drinks"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#c73b0f] hover:bg-[#a6300a] text-white px-5 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {editCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
