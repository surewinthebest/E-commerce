import { renderHook } from "@testing-library/react-native";
import { useAuth } from "@clerk/expo";
import { create } from "axios";
import { useApi } from "../api"; // adjust import path to your hook

// Mock external dependencies
jest.mock("@/src/config/Config", () => ({
    ExpoPublicApiUrl: "https://api.example.com"
}));

jest.mock("@clerk/expo", () => ({
    useAuth: jest.fn()
}));

jest.mock("axios", () => {
    const mockInterceptors = {
        request: {
            use: jest.fn(),
            eject: jest.fn()
        }
    };

    const mockAxiosInstance = {
        interceptors: mockInterceptors,
        defaults: {
            baseURL: "https://api.example.com",
            headers: { "Content-Type": "application/json" },
            timeout: 10000
        }
    };

    return {
        create: jest.fn(() => mockAxiosInstance)
    };
});

describe("useApi hook & api instance state", () => {
    let mockGetToken: jest.Mock;
    let mockUseInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetToken = jest.fn();
        (useAuth as jest.Mock).mockReturnValue({ getToken: mockGetToken });

        // Grab the mocked instance returned by axios.create
        mockUseInstance = create();
    });

    it("should configure the axios instance with correct base properties", () => {
        expect(create).toHaveBeenCalledWith({
            baseURL: "https://api.example.com",
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000
        });
    });

    it("should attach request interceptor on mount and eject on unmount", async () => {
        const { unmount } = await renderHook(() => useApi());

        expect(mockUseInstance.interceptors.request.use).toHaveBeenCalledTimes(1);

        unmount();

        expect(mockUseInstance.interceptors.request.eject).toHaveBeenCalledTimes(1);
    });

    it("should inject Authorization header when token exists in request interceptor", async () => {
        mockGetToken.mockResolvedValue("mock-jwt-token");

        renderHook(() => useApi());

        // Extract the callback function passed to api.interceptors.request.use
        const interceptorCallback = mockUseInstance.interceptors.request.use.mock.calls[0][0];

        // Simulate sending a request through the interceptor
        const dummyConfig = { headers: {} as Record<string, string> };
        const updatedConfig = await interceptorCallback(dummyConfig);

        expect(mockGetToken).toHaveBeenCalled();
        expect(updatedConfig.headers.Authorization).toBe("Bearer mock-jwt-token");
    });

    it("should not inject Authorization header when token is null or empty", async () => {
        mockGetToken.mockResolvedValue(null);

        renderHook(() => useApi());

        const interceptorCallback = mockUseInstance.interceptors.request.use.mock.calls[0][0];

        const dummyConfig = { headers: {} as Record<string, string> };
        const updatedConfig = await interceptorCallback(dummyConfig);

        expect(mockGetToken).toHaveBeenCalled();
        expect(updatedConfig.headers.Authorization).toBeUndefined();
    });
});