'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/axios';

export function useExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/exams');
      setExams(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    const { data } = await api.get(`/exams/${id}`);
    return data;
  }, []);

  const create = useCallback(async (payload) => {
    const { data } = await api.post('/exams', payload);
    setExams((prev) => [...prev, data]);
    return data;
  }, []);

  const update = useCallback(async (id, payload) => {
    const { data } = await api.put(`/exams/${id}`, payload);
    setExams((prev) => prev.map((e) => (e.id === id ? data : e)));
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await api.delete(`/exams/${id}`);
    setExams((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { exams, loading, error, fetchAll, fetchById, create, update, remove };
}
