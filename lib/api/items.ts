/**
 * API service layer for items CRUD operations
 */

export interface Item {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  createdAt?: number | string;
  updatedAt?: number | string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const BASE_URL = '/api/items';

/**
 * Fetch all items
 */
export async function getAllItems(): Promise<ApiResponse<Item[]>> {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: data.items || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch items',
    };
  }
}

/**
 * Fetch a single item by ID
 */
export async function getItemById(id: string): Promise<ApiResponse<Item>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: data.item,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch item',
    };
  }
}

/**
 * Create a new item
 */
export async function createItem(item: Omit<Item, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Item>> {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: data.item,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create item',
    };
  }
}

/**
 * Update an existing item
 */
export async function updateItem(id: string, updates: Partial<Omit<Item, 'id' | '_id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Item>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: data.item,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update item',
    };
  }
}

/**
 * Delete an item
 */
export async function deleteItem(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete item',
    };
  }
}
