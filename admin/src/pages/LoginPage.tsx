import { SignIn } from "@clerk/react";

function LoginPage() {
    return <div>
        <h1>Sign in to Admin Dashboard</h1>
        <SignIn />
        <button
            onClick={() => {
                throw new Error('This is your first error!');
            }}
        >
            Break the world
        </button>
    </div>
}

export default LoginPage;