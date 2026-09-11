import { trpc } from "~/trpc/client";

export const useSignup = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: createUserWithEmailAndPasswordAsync,
        mutate: createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } =
        trpc.auth.createUserWithInputSchema.useMutation({
            onSuccess: async () => {
                await utils.auth.getloggedInUserInfo.invalidate()
            }
        }
        )

    return {
        createUserWithEmailAndPasswordAsync,
        createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useSignIn = () => {
    const utils = trpc.useUtils()

    const {
        mutateAsync: signInUserWithEmailAndPasswordAsync,
        mutate: signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    } =
        trpc.auth.signInUserWithEmailAndPassword.useMutation({
            onSuccess: async () => {
                await utils.auth.getloggedInUserInfo.invalidate()
            }
        }
    );

    return {
        signInUserWithEmailAndPasswordAsync,
        signInUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useUser = () => {
    const { data: user, error, isFetched, isFetching, isLoading, status } = trpc.auth.getloggedInUserInfo.useQuery()

    return {
        user,
        error,
        isFetched,
        isFetching,
        isLoading,
        status
    }
}