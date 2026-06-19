import { useState, useEffect } from 'react';
import api from '../services/api';

export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/habits');
      setHabits(res.data.data || []);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch habits';
      console.error('[useHabits] fetchHabits error:', err.message, err.response?.status, err.response?.data);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (name, icon = '✅') => {
    const res = await api.post('/habits', { name, icon });
    await fetchHabits();
    return res.data.data;
  };

  const logStatus = async (id, date, status) => {
    await api.post(`/habits/${id}/log`, { date, status });
    await fetchHabits();
  };

  const updateHabit = async (id, name, icon) => {
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (icon !== undefined) payload.icon = icon;
    const res = await api.put(`/habits/${id}`, payload);
    await fetchHabits();
    return res.data.data;
  };

  const deleteHabit = async (id) => {
    await api.delete(`/habits/${id}`);
    await fetchHabits();
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return { habits, loading, error, fetchHabits, createHabit, logStatus, updateHabit, deleteHabit };
}
