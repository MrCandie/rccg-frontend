import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../context/auth";

interface FetchDataParams {
  url: string;
  token?: string;
  logout?: () => void;
  useHeaders?: boolean;
}

const fetchData = async ({
  url,
  token,
  useHeaders = true,
}: FetchDataParams) => {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const { data } = await axios.get(url, useHeaders ? { headers } : {});

    return data;
  } catch (error: any) {
    const errMessage = error.response?.data?.message || "Something went wrong";

    throw new Error(errMessage);
  }
};

interface UseGetParams {
  url: string;
  queryKey: string;
  useHeaders?: boolean;
}

const useGet = ({ url, queryKey, useHeaders = true }: UseGetParams) => {
  const { token, logout } = useAuth();

  return useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      fetchData({
        url,
        token,
        logout,
        useHeaders,
      }),
  });
};

export default useGet;
