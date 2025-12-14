export type Item = {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

const globalAny = globalThis as any;
if (!globalAny.__ITEM_STORE__) {
  globalAny.__ITEM_STORE__ = new Map<string, Item>();
}
const store: Map<string, Item> = globalAny.__ITEM_STORE__ as Map<string, Item>;

export function listItems(): Item[] {
  return Array.from(store.values());
}

export function getItem(id: string): Item | undefined {
  return store.get(id);
}

export function createItem(input: { id?: string; name: string; description?: string }): Item {
  const id = input.id ?? cryptoRandomId();
  const now = Date.now();
  const item: Item = {
    id,
    name: input.name,
    description: input.description,
    createdAt: now,
    updatedAt: now,
  };
  store.set(id, item);
  return item;
}

export function updateItem(id: string, input: { name?: string; description?: string }): Item | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;
  const updated: Item = {
    ...existing,
    name: input.name ?? existing.name,
    description: input.description ?? existing.description,
    updatedAt: Date.now(),
  };
  store.set(id, updated);
  return updated;
}

export function deleteItem(id: string): boolean {
  return store.delete(id);
}

function cryptoRandomId(): string {
  // Simple random id for demo; in production use a robust id generator
  return Math.random().toString(36).slice(2, 10);
}