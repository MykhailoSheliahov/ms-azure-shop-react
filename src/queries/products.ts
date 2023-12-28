import axios, { AxiosError } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { AvailableProduct, Product } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>(
    "available-products",
    async () => {
      const res = await axios.get<Product[]>(
        `${API_PATHS.bff}/products`,
        { 'headers': { 'Ocp-Apim-Subscription-Key': '4aec7aa45e4040a384529fd777984a64' } }
      );
      return res.data.map((product, index) => ({ ...product, count: index + 1 }));
    }
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<Product>(
        `${API_PATHS.bff}/products/${id}`,
        { 'headers': { 'Ocp-Apim-Subscription-Key': '4aec7aa45e4040a384529fd777984a64' } }
      );
      return { ...res.data, count: 10 };
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: AvailableProduct) =>
    axios.put<AvailableProduct>(`${API_PATHS.bff}/product`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.bff}/product/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
