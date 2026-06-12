import { useCallback, useEffect, useState } from "react";

interface UseFetchOptions<T> {
  transform?: (data: any) => T;
}

export function useFetch<T>(url: string | null, options: UseFetchOptions<T> = {}) {
  const { transform } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(url));
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const payload = await response.json();
      setData(transform ? transform(payload) : (payload as T));
    } catch (err: any) {
      setError(err?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, [url, transform]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
