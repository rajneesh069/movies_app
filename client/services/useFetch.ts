import { useCallback, useEffect, useState } from "react";

export const useFetch = <T>(
  fetchFunction: () => Promise<T>,
  autoFetch: boolean = true
) => {
  const [data, setData] = useState<T | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    () => async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFunction();
        setData(result);
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error(`An error occured`)
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction]
  );

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, reset, refetch: fetchData, loading, error };
};
