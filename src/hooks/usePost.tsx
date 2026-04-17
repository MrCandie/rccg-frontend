import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";

interface PostDataParams {
  url: string;
  body: any;
  message?: string;
  token?: string;
  contentType?: string;
  authorization?: string;
  logout: () => void;
}

interface CustomError extends Error {
  statusCode?: number;
}

const postData = async ({
  url,
  body,
  message,
  token,
  contentType = "application/json",
  authorization,
  logout,
}: PostDataParams) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
    Authorization: authorization || `Bearer ${token}`,
  };

  try {
    const { data } = await axios.post(url, body, { headers });

    if (message) toast.success(message);

    return data;
  } catch (error: any) {
    const statusCode = error.response?.status || 500;
    const errorBody = error.response?.data?.message || "Something went wrong";

    const messages = ["unauthenticated", "authentication failed"];

    if (messages.includes(String(errorBody).toLowerCase())) logout();

    const message =
      typeof errorBody !== "string" ? "Something went wrong" : errorBody;

    toast.error(message);

    const customError: CustomError = new Error(message);
    customError.statusCode = statusCode;

    throw customError;
  }
};

interface UsePostParams {
  queryKey: string;
  url: string;
  title?: string;
  onSuccess: (data: any, variables: any) => void;
  onError?: (
    error: { statusCode: string | number; message: string },
    variables: any,
  ) => void;
  contentType?: string;
  authorization?: string;
}

export const usePost = ({
  queryKey,
  url,
  title,
  onSuccess,
  onError,
  contentType,
  authorization,
}: UsePostParams) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) =>
      postData({
        url,
        body,
        message: title,
        token,
        contentType,
        authorization,
        logout,
      }),
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error: any, variables) => {
      const statusCode = error.statusCode || "Unknown";
      const errorMessage = error.message || "An error occurred";

      if (onError) {
        onError({ statusCode, message: errorMessage }, variables);
      }
    },
  });
};
