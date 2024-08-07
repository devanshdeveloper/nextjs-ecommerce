"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const useOptimisticMutation = ({ infiniteQueryKeys, queryKeys, ...params }) => {
  const queryClient = useQueryClient();
  const keys = queryKeys || infiniteQueryKeys;
  const mutate = useMutation({
    ...params,
    onMutate: async (data) => {
      await queryClient.cancelQueries(keys);
      const previousData = queryClient.getQueryData(keys);
      queryClient.setQueriesData(keys, (oldData) =>
        params.actionFunc(data, oldData)
      );
      return { previousData };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueriesData(infiniteQueryKeys, context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(infiniteQueryKeys);
    },
  });
  return {
    ...mutate,
  };
};
export default useOptimisticMutation;
