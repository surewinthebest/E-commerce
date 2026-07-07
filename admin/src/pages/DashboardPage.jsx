import { useQuery } from "@tanstack/react-query"
import { orderApi, statsApi } from "../lib/api"
import { DollarSignIcon, ShoppingBagIcon, UsersIcon, PackageIcon } from "lucide-react";
import { getOrderStatusBadge, capitalizeText, formatDate } from "../lib/utils";

function DashboardPage() {
    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: orderApi.getAll,
    });

    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ["dashboardStats"],
        queryFn: statsApi.getDashboard,
    });

    const recentOrders = ordersData?.orders?.slice(0, 5) || [];

    const statsCards = [
        {
            name: "Total Revenue",
            value: statsLoading ? "..." : `$${statsData?.totalRevenue?.toFixed(2)}`,
            icon: <DollarSignIcon className="w-8 h-8" />
        },
        {
            name: "Total Orders",
            value: statsLoading ? "..." : `${statsData.totalOrder}`,
            icon: <ShoppingBagIcon className="w-8 h-8" />
        },
        {
            name: "Total Customer",
            value: statsLoading ? "..." : `${statsData.totalCustomers}`,
            icon: <UsersIcon className="w-8 h-8" />
        },
        {
            name: "Total Products",
            value: statsLoading ? "..." : `${statsData.totalProducts}`,
            icon: <PackageIcon className="w-8 h-8" />
        },
    ]

    return (
        <div className="space-y-6">
            {/* {STATS} */}
            <div className="stats stats-vertical lg:stat-horizontal shadow w-full bg-base-100">
                {
                    statsCards.map((stat) => {
                        return (
                            <div key={stat.name} className="stat">
                                <div className="stat-figure text-primary">{stat.icon}</div>
                                <div className="stat-title">{stat.name}</div>
                                <div className="stat-value">{stat.value}</div>
                            </div>
                        )
                    })
                }
            </div>

            {/* {RECENT ORDERS} */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Recent Orders</h2>
                    {ordersLoading ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-base-content/60">No orders yet</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => {
                                        return (<tr key={order._id}>
                                            <td>
                                                <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                                            </td>

                                            <td>
                                                <div>
                                                    <div className="font-medium">{order.shippingAddress.fullname}</div>
                                                    <div className="text-sm opacity-60">{order.orderItems.length} item(s)</div>
                                                </div>

                                            </td>

                                            <td>
                                                <div className="text-sm">
                                                    {order.orderItems[0]?.name}
                                                    {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="font-semibold">{order.totalPrices.toFixed(2)}</span>
                                            </td>

                                            <td>
                                                <div className={`badge ${getOrderStatusBadge(order.status)}`}>
                                                    {capitalizeText(order.status)}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span>
                                            </td>
                                        </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;