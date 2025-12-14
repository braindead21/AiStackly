'use client';

import { Item } from '@/lib/api/items';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  isDeleting?: boolean;
}

export default function ItemCard({ item, onEdit, onDelete, isDeleting }: ItemCardProps) {
  const itemId = item._id || item.id || '';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 break-words flex-1">
          {item.name}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 shrink-0">
          ID: {itemId.slice(0, 8)}...
        </span>
      </div>
      
      {item.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4 break-words">
          {item.description}
        </p>
      )}
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(item)}
          disabled={isDeleting}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item)}
          disabled={isDeleting}
          className="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
