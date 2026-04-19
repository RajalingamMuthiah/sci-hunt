'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/axios';

export function useQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.subject) params.subject = filters.subject;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.type) params.type = filters.type;

      const { data } = await api.get('/api/questions', { params });
      setQuestions(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    const { data } = await api.get(`/api/questions/${id}`);
    return data;
  }, []);

  const create = useCallback(async (payload) => {
    const { data } = await api.post('/api/questions', payload);
    setQuestions((prev) => [...prev, data]);
    return data;
  }, []);

  const update = useCallback(async (id, payload) => {
    const { data } = await api.put(`/api/questions/${id}`, payload);
    setQuestions((prev) => prev.map((q) => (q.id === id ? data : q)));
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await api.delete(`/api/questions/${id}`);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  return { questions, loading, error, fetchAll, fetchById, create, update, remove };
}
