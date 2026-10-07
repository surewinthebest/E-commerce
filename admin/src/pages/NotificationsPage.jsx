import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../lib/api";
import { formatDate } from "../lib/utils";
import { BellIcon, SendIcon, HistoryIcon, UserIcon, UsersIcon, AlertCircleIcon } from "lucide-react";

function NotificationsPage() {
    const queryClient = useQueryClient();

    // Form state
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [targetType, setTargetType] = useState("ALL");
    const [userId, setUserId] = useState("");
    const [url, setUrl] = useState("");
    
    // Feedback state
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch notification log history
    const { data: historyData, isLoading: historyLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: notificationApi.getHistory,
    });

    // Mutation to send push notifications
    const sendNotificationMutation = useMutation({
        mutationFn: notificationApi.send,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            setTitle("");
            setBody("");
            setUserId("");
            setUrl("");
            setErrorMessage("");
            setSuccessMessage("Push notification dispatched successfully!");
            setTimeout(() => setSuccessMessage(""), 4000);
        },
        onError: (error) => {
            console.error("Failed to send notification:", error);
            const serverError = error.response?.data?.message || error.message || "Failed to send push notification";
            setErrorMessage(serverError);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Validation checks
        if (!title.trim()) {
            setErrorMessage("Please enter a notification title.");
            return;
        }
        if (!body.trim()) {
            setErrorMessage("Please enter a message body.");
            return;
        }
        if (targetType === "USER" && !userId.trim()) {
            setErrorMessage("Please enter a valid User Database ID.");
            return;
        }

        sendNotificationMutation.mutate({
            title: title.trim(),
            body: body.trim(),
            targetType,
            userId: targetType === "USER" ? userId.trim() : undefined,
            url: url.trim() || undefined,
        });
    };

    const notifications = historyData?.notifications || [];

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BellIcon className="w-7 h-7 text-primary" /> Notifications
                </h1>
                <p className="text-base-content/70">
                    Send push notifications to Expo mobile app users and review delivery history
                </p>
            </div>

            {/* ALERT SUCCESS */}
            {successMessage && (
                <div className="alert alert-success shadow-lg">
                    <SendIcon className="w-5 h-5 text-success-content" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* ALERT ERROR */}
            {errorMessage && (
                <div className="alert alert-error shadow-lg">
                    <AlertCircleIcon className="w-5 h-5 text-error-content" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* FORM AND HISTORY GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* COMPOSE FORM */}
                <div className="card bg-base-100 shadow-xl h-fit">
                    <div className="card-body">
                        <h2 className="card-title text-lg flex items-center gap-2">
                            <SendIcon className="w-5 h-5 text-primary" /> Send Push Broadcast
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                            {/* TARGET SELECTION */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Target Audience</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setTargetType("ALL")}
                                        className={`btn btn-sm ${
                                            targetType === "ALL" ? "btn-primary" : "btn-outline"
                                        }`}
                                    >
                                        <UsersIcon className="w-4 h-4 mr-1" /> All Users
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTargetType("USER")}
                                        className={`btn btn-sm ${
                                            targetType === "USER" ? "btn-primary" : "btn-outline"
                                        }`}
                                    >
                                        <UserIcon className="w-4 h-4 mr-1" /> Specific User
                                    </button>
                                </div>
                            </div>

                            {/* USER ID INPUT */}
                            {targetType === "USER" && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">User Database ID</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 64f1a2b3c4d5e6f7a8b9c0d1"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="input input-bordered input-sm w-full"
                                        required
                                    />
                                </div>
                            )}

                            {/* TITLE INPUT */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Flash Sale Live! 🚀"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* BODY INPUT */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Message Body</span>
                                </label>
                                <textarea
                                    placeholder="e.g. Enjoy up to 50% off on all footwear items today only."
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="textarea textarea-bordered h-28 w-full"
                                    required
                                />
                            </div>

                            {/* URL INPUT */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Link</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder={'e.g., "/product/123" OR "https://google.com"'}
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={sendNotificationMutation.isPending}
                                className="btn btn-primary w-full mt-2"
                            >
                                {sendNotificationMutation.isPending ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    <>
                                        <SendIcon className="w-4 h-4 mr-2" /> Send Notification
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* HISTORY LOG TABLE */}
                <div className="card bg-base-100 shadow-xl lg:col-span-2">
                    <div className="card-body">
                        <h2 className="card-title text-lg flex items-center gap-2">
                            <HistoryIcon className="w-5 h-5 text-primary" /> Notification Log
                        </h2>

                        {historyLoading ? (
                            <div className="flex justify-center py-12">
                                <span className="loading loading-spinner loading-lg" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12 text-base-content/60">
                                <p className="text-lg font-semibold mb-1">No notifications sent yet</p>
                                <p className="text-sm">Broadcasted messages will appear in this feed.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Title & Body</th>
                                            <th>Target</th>
                                            <th>Recipient</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notifications.map((notif) => (
                                            <tr key={notif._id}>
                                                <td>
                                                    <div className="font-semibold text-base-content">{notif.title}</div>
                                                    <div className="text-sm text-base-content/70 line-clamp-2">
                                                        {notif.body}
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge badge-sm ${
                                                            notif.targetType === "ALL"
                                                                ? "badge-primary"
                                                                : "badge-secondary"
                                                        }`}
                                                    >
                                                        {notif.targetType}
                                                    </span>
                                                </td>

                                                <td>
                                                    {notif.targetType === "USER" && notif.recipientUser ? (
                                                        <div>
                                                            <div className="font-medium text-xs">
                                                                {notif.recipientUser.name}
                                                            </div>
                                                            <div className="text-xs opacity-60">
                                                                {notif.recipientUser.email}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs opacity-50">All App Users</span>
                                                    )}
                                                </td>

                                                <td>
                                                    <span className="text-xs opacity-60">
                                                        {formatDate(notif.createdAt)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default NotificationsPage;