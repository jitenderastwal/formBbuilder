import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.forms.createForm.useMutation({
    onSuccess: async () => {
      await utils.forms.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };

  
};

export const useListForms = () => {
  const {
    data: forms,
    error,
    isError,
    isLoading,
    isFetching,
    isSuccess,
    status,
    refetch,
  } = trpc.forms.listFormsByUserId.useQuery({});

  return {
    forms: forms ?? [],
    error,
    isError,
    isLoading,
    isFetching,
    isSuccess,
    status,
    refetch,
  };
};