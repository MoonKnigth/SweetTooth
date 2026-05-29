'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Product } from '@/types';
import { toast } from 'react-toastify';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
}

export default function ProductFormModal({ isOpen, onClose, productToEdit }: ProductFormModalProps) {
  const { token, setProducts } = useApp();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('1'); // Default category
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setTimeout(() => {
        setName(productToEdit.name);
        setCategoryId(productToEdit.categoryId.toString());
        setPrice(productToEdit.price.toString());
        setImageUrl(productToEdit.imageUrl);
        setIsActive(productToEdit.isActive);
      }, 0);
    } else {
      setTimeout(() => {
        setName('');
        setCategoryId('1');
        setPrice('');
        setImageUrl('');
        setIsActive(true);
      }, 0);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name,
      category_id: parseInt(categoryId),
      price: parseFloat(price),
      image_thumbnail: imageUrl,
      isActive
    };

    try {
      const url = productToEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${productToEdit.id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/products`;
      
      const method = productToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const p = data.data;
        const newProduct: Product = {
          id: p.id,
          name: p.name,
          categoryId: p.category_id,
          categoryName: p.category || 'Unknown',
          price: parseFloat(p.price),
          imageUrl: p.image_thumbnail,
          isActive: p.isActive
        };

        if (productToEdit) {
          // Update existing
          setProducts((prev: Product[]) => prev.map(prod => prod.id === newProduct.id ? newProduct : prod));
          toast.success('Product updated successfully!');
        } else {
          // Add new
          setProducts((prev: Product[]) => [...prev, newProduct]);
          toast.success('Product created successfully!');
        }
        
        onClose();
      } else {
        toast.error('Failed to save menu: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {productToEdit ? 'Edit Menu' : 'Add New Menu'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menu Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Strawberry Shortcake" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
              <input type="number" required min="1" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" step="0.01" required min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 5.50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="url" required value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
          </div>

          <div className="flex items-center mt-2">
            <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active (Visible to customers)</label>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Save Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
