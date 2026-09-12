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

export const useCreateFormField = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.forms.createFormField.useMutation({
    onSuccess: async () => {
      await utils.forms.invalidate();
    },
  });

  return {
    createFormFieldAsync: mutation.mutateAsync,
    createFormField: mutation.mutate,
    ...mutation,
  };
};

export const useGetFormField = (id?: string) => {
  const query = trpc.forms.getFormField.useQuery(
    { id: id ?? '' },
    { enabled: Boolean(id) },
  );

  return {
    field: query.data,
    ...query,
  };
};

export const useUpdateFormField = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.forms.updateFormField.useMutation({
    onSuccess: async () => {
      await utils.forms.invalidate();
    },
  });

  return {
    updateFormFieldAsync: mutation.mutateAsync,
    updateFormField: mutation.mutate,
    ...mutation,
  };
};

export const useDeleteFormField = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.forms.deleteFormField.useMutation({
    onSuccess: async () => {
      await utils.forms.invalidate();
    },
  });

  return {
    deleteFormFieldAsync: mutation.mutateAsync,
    deleteFormField: mutation.mutate,
    ...mutation,
  };
};