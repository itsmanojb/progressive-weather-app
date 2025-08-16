import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  retry: () => void;
}

const useFetch = <T>(
  url: string,
  config?: AxiosRequestConfig,
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [retries, setRetries] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<T>(url, config);
      setData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err);
      } else {
        setError(new AxiosError('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, [url, config]);

  useEffect(() => {
    fetchData();
  }, [fetchData, retries]);

  const retry = () => {
    setRetries((prevRetries) => prevRetries + 1);
  };

  return { data, loading, error, retry };
};

export default useFetch;
