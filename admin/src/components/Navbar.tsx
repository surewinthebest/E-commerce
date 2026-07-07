import { UserButton } from "@clerk/react";
import { PanelLeftIcon } from "lucide-react"
import { useLocation } from "react-router"
import { NAVIGATION } from "../config/Navigation"

function Navbar() {

    const location = useLocation();

    return (
        <div className="navbar w-full bg-base-300">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost" aria-label="open sidebar">
                <PanelLeftIcon className="size-5" />
            </label>
            <div className="flex-1 px-4">
                <h1 className="text-xl font-bold">
                    {NAVIGATION.find((item) => item.path === location.pathname)?.name || "Dashboard"}
                </h1>
            </div>

            <div className="mr-5">
                <UserButton />
            </div>
        </div>
    )
}


export default Navbar

