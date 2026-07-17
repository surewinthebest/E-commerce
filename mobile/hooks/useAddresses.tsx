import { View, Text } from 'react-native'
import React from 'react'
import { useApi } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Address } from '@/types';

const useAddresses = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    const { data: addresses, isLoading, isError } = useQuery({
        queryKey: ["addresses"],
        queryFn: async () => {
            const { data } = await api.get<{ addresses: Address[] }>("/users/addresses");
            return data.addresses;
        }
    });

    const addAddress = useMutation({
        mutationKey: ["addresses"],
        mutationFn: async (addressData: Omit<Address, "_id">) => {
            const { data } = await api.post<{ addresses: Address[] }>("/users/addresses", addressData);
            return data.addresses;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        }
    })

    const updateAddress = useMutation({
        mutationKey: ["addresses"],
        mutationFn: async ({
            addressId,
            addressData,
        }: {
            addressId: string;
            addressData: Partial<Address>;
        }) => {
            const { data } = await api.put<{ addresses: Address[] }>(`/users/addresses/${addressId}`, addressData);
            return data.addresses;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        }
    })

    const deleteAddress = useMutation({
        mutationKey: ["addresses"],
        mutationFn: async (addressId: string) => {
            const { data } = await api.delete<{ addresses: Address[] }>(`/users/addresses/${addressId}`);
            return data.addresses;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        }
    })


    return {
        addresses,
        isLoading,
        isError,
        addAddress: addAddress.mutate,
        updateAddress: updateAddress.mutate,
        deleteAddress: deleteAddress.mutate,
        isAddingAddress: addAddress.isPending,
        isUpdatingAddress: updateAddress.isPending,
        isDeletingAddress: deleteAddress.isPending
    }
}

export default useAddresses