import { useAuth } from "@clerk/expo";
import axios from "axios";
import { useCallback, useEffect } from "react";

const VITE_API_URL = "https://expo-e-commerce-1tspv.sevalla.app/api";

const api = axios.create({
    baseURL: VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

export const useApi = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        const interceptors = api.interceptors.request.use(async (config) => {
            const token = await getToken();
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        })

        return () => {
            api.interceptors.request.eject(interceptors)
        }
    }, [getToken])

    return api;
}

