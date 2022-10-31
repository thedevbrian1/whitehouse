import { Link, Form } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export function meta() {
  return {
    title: 'White House Court',
    description: 'Log in to White House Court or register as a tenant of Whiet House Court'
  };
}

export default function Index() {
  const user = useOptionalUser();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative w-screen sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {user
            ? (
              <div className="w-full flex justify-end pr-8">
                <Form action="/logout" method="post">
                  <button
                    type="submit"
                    className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                  >
                    Logout
                  </button>
                </Form>
              </div>
            )
            : null}

          <div className="relative border border-gray-100 sm:overflow-hidden sm:rounded-2xl">
            <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <div>
                    <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                      Hello {user.email}
                    </h1>

                    <div className="flex justify-center mt-4">
                      <Link to="/dashboard" className=" rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
                        Go to dashboard
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto max-w-7xl">
                    <h1 className="font-bold text-3xl lg:text-6xl"> White House Court</h1>
                    <h2 className="font-semibold text-xl lg:text-3xl text-center">Kindly login to continue</h2>
                    <div className="flex justify-center">
                      <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0 mt-4">
                        <Link
                          to="/register"
                          className="flex items-center justify-center rounded-md border border-blue-700 bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
                        >
                          Register
                        </Link>

                        <Link
                          to="/login"
                          className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600  "
                        >
                          Log In
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <a href="https://remix.run">
                <img
                  src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                  alt="Remix"
                  className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
