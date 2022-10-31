import { ArrowLeftIcon } from "@heroicons/react/outline";
import { Link } from "@remix-run/react";

export default function Success() {
    return (
        <main className="w-full h-full grid place-items-center">
            <div className="space-y-6">
                <h1 className="font-bold text-2xl lg:text-4xl lg:text-center">Success</h1>
                <div className="w-80 h-80">
                    <img src="/success.svg" alt="" />
                </div>
                <div className="flex justify-center">
                    <Link to="/register" className="text-blue-500 hover:text-blue-700">
                        <ArrowLeftIcon className="w-5 h-5 inline" /> Back to registration form
                    </Link>
                </div>
            </div>
        </main>
    )
}