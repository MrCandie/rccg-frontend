import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";

interface PatchDataParams {
  url: string;
  body: any;
  message?: string;
  token?: string;
  contentType?: string;
  showToast?: boolean;
  logout?: () => void;
}

interface CustomError extends Error {
  statusCode?: number;
}

const patchData = async ({
  url,
  body,
  message,
  token,
  contentType = "application/json",
  showToast = true,
}: PatchDataParams) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
    Authorization: `Bearer ${token}`,
  };

  try {
    const { data } = await axios.patch(url, body, { headers });

    if (message) toast.success(message);

    return data;
  } catch (error: any) {
    const statusCode = error.response?.status || 500;
    const errorBody = error.response?.data?.message || "Something went wrong";

    const messageText =
      typeof errorBody !== "string" ? "Something went wrong" : errorBody;

    if (showToast) toast.error(messageText);

    const customError: CustomError = new Error(errorBody);
    customError.statusCode = statusCode;

    throw customError;
  }
};

interface UsePatchParams {
  queryKey: string;
  url: string;
  title?: string;
  onSuccess: (data: any, variables: any) => void;
  contentType?: string;
  showToast?: boolean;
}

export const usePatch = ({
  queryKey,
  url,
  title,
  onSuccess,
  contentType = "application/json",
  showToast = true,
}: UsePatchParams) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) =>
      patchData({
        url,
        body,
        message: title,
        token,
        contentType,
        showToast,
      }),
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};
