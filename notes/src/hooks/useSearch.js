import { useState, useCallback } from 'react';

export const useSearch = (items, searchKeys = ['title', 'content']) => {
  const [filteredItems, setFilteredItems] = useState(items);

  const performSearch = useCallback((searchTerm) => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = items.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        return value && value.toLowerCase().includes(lowerSearchTerm);
      });
    });

    setFilteredItems(filtered);
  }, [items, searchKeys]);

  return { filteredItems, performSearch };
};