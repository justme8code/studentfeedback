import { useQuery } from "@tanstack/react-query";
import { getActiveSession } from "@/lib/api/calls/session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createCriterion, getCriteria, updateCriterion} from "@/lib/api/calls/criterion";
import {CreateCriterionPayload, Criterion, UpdateCriterionPayload} from "@/lib/types/criterion";


export function useCriteria() {
    return useQuery({
        queryKey: ['use-criteria'],
        queryFn: async () => {
            const res = await getCriteria();
            if (!res.status) throw new Error(res.error.message || 'Failed to fetch criteria');
            return res.data;
        },
    });
}


export function useCreateCriterion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newCriterion: CreateCriterionPayload) => {
            const res = await createCriterion(newCriterion);
            if (!res.status) throw new Error(res.error.message || 'Failed to create criterion');
            return res.data; // This can return Criterion | null
        },
        // The type of newItem is inferred as Criterion | null
        onSuccess: (newItem) => {
            if (!newItem) {
                return;
            }
            queryClient.setQueryData<Criterion[]>(['use-criteria'], (oldData) => {
                if (!oldData) {
                    return [newItem];
                }
                return [...oldData, newItem];
            });
        }
    });
}



export function useUpdateCriterion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateCriterionPayload }) => {
            const res = await updateCriterion(data,id);
            if (!res.status || !res.data) throw new Error('Failed to update criterion');
            return res.data;
        },
        // 1. When the mutation starts, before the API call...
        onMutate: async (updatedCriterion) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ['use-criteria'] });

            // Snapshot the previous value
            const previousCriteria = queryClient.getQueryData<Criterion[]>(['use-criteria']);

            // Optimistically update to the new value
            queryClient.setQueryData<Criterion[]>(['use-criteria'], (oldData = []) =>
                oldData.map(item =>
                    item.id === updatedCriterion.id
                        ? { ...item, ...updatedCriterion.data } // Merge old item with new data
                        : item
                )
            );

            // Return a context object with the snapshotted value
            return { previousCriteria };
        },
        // 2. If the mutation fails, use the context we returned from onMutate to roll back
        onError: (err, newCriterion, context) => {
            if (context?.previousCriteria) {
                queryClient.setQueryData(['use-criteria'], context.previousCriteria);
            }
        },
        // 3. Finally, always refetch after the mutation is settled (success or error)
        //    to ensure our cache is in sync with the server.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['use-criteria'] });
        },
    });
}