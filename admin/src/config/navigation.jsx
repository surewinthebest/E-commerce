import { ClipboardListIcon, HomeIcon, ShoppingBagIcon, UserIcon } from "lucide-react"

export const NAVIGATION = [
    { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className="size-5" /> },
    { name: "Products", path: "/products", icon: <ShoppingBagIcon className="size-5" /> },
    { name: "Customers", path: "/customers", icon: <UserIcon className="size-5" /> },
    { name: "Orders", path: "/orders", icon: <ClipboardListIcon className="size-5" /> },
]