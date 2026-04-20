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
      const { data } = await api.post('/attempts', { examId, answers });
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
      const { data } = await api.get('/attempts/my');
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
    const { data } = await api.get(`/attempts/exam/${examId}`);
    return data;
  }, []);

  const fetchMyAttemptForExam = useCallback(async (examId) => {
    const { data } = await api.get(`/attempts/exam/${examId}/my`);
    return data;
  }, []);

  const fetchPendingGrading = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/attempts/pending-grading');
      setAttempts(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const gradeDescriptive = useCallback(async (attemptId, grades) => {
    const { data } = await api.patch(`/attempts/${attemptId}/grade-descriptive`, { grades });
    return data;
  }, []);

  return { attempts, loading, error, submit, fetchMine, fetchByExam, fetchMyAttemptForExam, fetchPendingGrading, gradeDescriptive };
}
