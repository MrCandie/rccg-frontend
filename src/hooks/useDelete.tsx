import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";

interface DeleteDataParams {
  url: string;
  message?: string;
  token?: string;
  logout?: () => void;
}

interface CustomError extends Error {
  statusCode?: number;
}

const deleteData = async ({
  url,
  message,
  token,
  logout,
}: DeleteDataParams) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const { data } = await axios.delete(url, { headers });

    if (message) toast.success(message);

    return data;
  } catch (error: any) {
    const statusCode = error.response?.status || 500;
    const errorBody = error.response?.data?.message || "Something went wrong";

    const messages = ["unauthenticated", "authentication failed"];

    if (messages.includes(String(errorBody).toLowerCase())) {
      logout?.();
    }

    const messageText =
      typeof errorBody !== "string" ? "Something went wrong" : errorBody;

    toast.error(messageText);

    const customError: CustomError = new Error(errorBody);
    customError.statusCode = statusCode;

    throw customError;
  }
};

interface UseDeleteParams {
  queryKey: string;
  url: string;
  title?: string;
  onSuccess?: (data: any, variables: any) => void;
}

export const useDelete = ({
  queryKey,
  url,
  title,
  onSuccess,
}: UseDeleteParams) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteData({
        url,
        message: title,
        token,
        logout,
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      if (onSuccess) onSuccess(data, variables);
    },
  });
};
