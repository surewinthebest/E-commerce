import axiosInstance from "./axios"

export const productApi = {
    getAll: async () => {
        const { data } = await axiosInstance.get("/admin/products");
        return data;
    },

    create: async (formData) => {
        const { data } = await axiosInstance.post("/admin/products", formData);
        return data;
    },

    update: async ({id, formData}) => {
        const { data } = await axiosInstance.put(`/admin/products/${id}`, formData);
        return data;
    },

    delete: async (id) => {
        const { data } = await axiosInstance.delete(`/admin/products/${id}`);
        return data;
    }
}

export const orderApi = {
    getAll: async () => {
        const { data } = await axiosInstance.get("/admin/orders");
        return data;
    },

    updateStatus: async ({orderId, status}) => {
        const { data } = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
        return data;
    },
}

export const customerApi = {
    getAll: async () => {
        const { data } = await axiosInstance.get("/admin/customers");
        return data;
    }
}

export const statsApi = {
    getDashboard: async () => {
        const { data } = await axiosInstance.get("/admin/stats");
        return data;
    }
}

export const notificationApi = {
    // Fetch notification broadcast history
    getHistory: async () => {
        const { data } = await axiosInstance.get("/notifications/history");
        return data;
    },

    // Dispatch a push notification
    send: async (payload) => {
        const { data } = await axiosInstance.post("/notifications/send", payload);
        return data;
    },
};