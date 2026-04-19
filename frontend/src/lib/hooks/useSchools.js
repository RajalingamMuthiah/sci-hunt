'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/axios';

export function useSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/schools');
      setSchools(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    const { data } = await api.post('/api/schools', payload);
    setSchools((prev) => [...prev, data]);
    return data;
  }, []);

  const update = useCallback(async (id, payload) => {
    const { data } = await api.put(`/api/schools/${id}`, payload);
    setSchools((prev) => prev.map((s) => (s.id === id ? data : s)));
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await api.delete(`/api/schools/${id}`);
    setSchools((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { schools, loading, error, fetchAll, create, update, remove };
}
