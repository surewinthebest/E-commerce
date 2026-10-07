import { Color } from "@/src/models/Color";

export const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return Color.ProfileYellow;
        case 'delivered':
            return Color.ProfileGreen;
        case 'shipped':
            return Color.ProfileBlue;
        default:
            return Color.ProfileBlue;
    }
}
