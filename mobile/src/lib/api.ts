import { useAuth } from "@clerk/expo";
import { create } from "axios";
import { useEffect } from "react";

const api = create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    //config.ExpoPublicApiUrl,
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

