import {
  useQuery,
  UseQueryOptions,
  QueryKey,
} from "@tanstack/react-query";

export function useXQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  >
) {
  const result = useQuery(options);

  return {
    ...result,
    isLoaded:
      result.status === "success",
  };
}