import { useUser } from "@clerk/react";
import { ClipboardListIcon, HomeIcon, ShoppingBagIcon, UserIcon } from "lucide-react"
import { Link, useLocation } from "react-router";

export const NAVIGATION = [
    { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className="size-5" /> },
    { name: "Products", path: "/products", icon: <ShoppingBagIcon className="size-5" /> },
    { name: "Customers", path: "/customers", icon: <ClipboardListIcon className="size-5" /> },
    { name: "Orders", path: "/orders", icon: <UserIcon className="size-5" /> },
]

function Sidebar() {

    const { user } = useUser();
    const location = useLocation();

    return (
        <div className="drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">

                <div className="p-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center">
                            <ShoppingBagIcon className="" w-6 h-6 text-primary-content />
                        </div>
                        <span className="text-xl font-bold is-drawer-close:hidden">Admin</span>
                    </div>
                </div>

                <ul className="menu w-full grow flex flex-col gap-2">
                    {NAVIGATION.map(item => {
                        const isActive = location.pathname === item.path
                        return (<li key={item.path}>
                            <Link to={item.path} className={`is-drawer-close:tooltip is-drawer-close:tooltip-right 
                                ${isActive ? "bg-primary text-primary-content" : ""}`}>
                                {item.icon}
                                <span className="is-drawer-close:hidden">{item.name}</span>
                            </Link>
                        </li>)
                    })}
                </ul>

                <div className="p-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="avatar shrink-0">
                            <img src={user?.imageUrl} alt={user?.firstName} className="rounded-full is-drawer-close:w-5 is-drawer-close:h-5 is-drawer-open:w-8 is-drawer-open:h-8 " />
                        </div>
                        <div className="flex-1 min-w-0 is-drawer-close:hidden">
                            <p className="text-sm font-semibold truncate">
                                {user?.firstName} {user?.lastName}
                            </p>

                            <p className="text-xs opacity-60 truncate">{user?.emailAddresses[0].emailAddress}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Sidebar
