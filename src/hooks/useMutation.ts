import { useMutation as useApolloMutation } from '@apollo/client';
import type { MutationHookOptions, DocumentNode } from '@apollo/client';

/**
 * Generic mutation hook that wraps Apollo's useMutation with consistent interface
 * Eliminates duplication between useLikePost, useComment, etc.
 */
export function useMutation<TData = unknown, TVariables = Record<string, unknown>>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>
) {
  const [mutate, { loading, error, data }] = useApolloMutation<TData, TVariables>(mutation, options);
  
  return {
    mutate,
    loading,
    error,
    data,
  };
}
