'use client';

import { useEffect, useState, useCallback } from 'react';
import { Item, getAllItems, createItem, updateItem, deleteItem } from '@/lib/api/items';
import ItemCard from '@/components/items/ItemCard';
import ItemForm from '@/components/items/ItemForm';
import { ToastContainer } from '@/components/items/Toast';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };

export default function ItemsManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    const response = await getAllItems();
    if (response.success && response.data) {
      setItems(response.data);
    } else {
      addToast(response.error || 'Failed to load items', 'error');
    }
    setIsLoading(false);
  }, [addToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (data: { name: string; description: string }) => {
    setIsSaving(true);
    const response = await createItem(data);
    setIsSaving(false);

    if (response.success) {
      addToast('Item created successfully', 'success');
      setShowForm(false);
      fetchItems();
    } else {
      addToast(response.error || 'Failed to create item', 'error');
    }
  };

  const handleUpdate = async (data: { name: string; description: string }) => {
    if (!editingItem) return;
    const id = editingItem._id || editingItem.id || '';
    
    setIsSaving(true);
    const response = await updateItem(id, data);
    setIsSaving(false);

    if (response.success) {
      addToast('Item updated successfully', 'success');
      setEditingItem(null);
      setShowForm(false);
      fetchItems();
    } else {
      addToast(response.error || 'Failed to update item', 'error');
    }
  };

  const handleDelete = async (item: Item) => {
    const id = item._id || item.id || '';
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    setDeletingId(id);
    const response = await deleteItem(id);
    setDeletingId(null);

    if (response.success) {
      addToast('Item deleted successfully', 'success');
      fetchItems();
    } else {
      addToast(response.error || 'Failed to delete item', 'error');
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Items Manager</h1>
        {!showForm && (
          <button
            onClick={handleNewItem}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + New Item
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ItemForm
            item={editingItem || undefined}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No items found. Create your first item to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const itemId = item._id || item.id || '';
            return (
              <ItemCard
                key={itemId}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === itemId}
              />
            );
          })}
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
