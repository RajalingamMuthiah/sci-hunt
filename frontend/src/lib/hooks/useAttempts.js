'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/axios';

export function useAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async (examId, answers) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/api/attempts', { examId, answers });
      setAttempts((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMine = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/attempts/my');
      setAttempts(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByExam = useCallback(async (examId) => {
    const { data } = await api.get(`/api/attempts/exam/${examId}`);
    return data;
  }, []);

  const fetchMyAttemptForExam = useCallback(async (examId) => {
    const { data } = await api.get(`/api/attempts/exam/${examId}/my`);
    return data;
  }, []);

  return { attempts, loading, error, submit, fetchMine, fetchByExam, fetchMyAttemptForExam };
}
