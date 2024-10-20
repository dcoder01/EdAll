import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Side partition with website name */}
      <div className="flex items-center justify-center bg-black w-1/3 p-8">
        <h1 className="text-5xl font-bold text-white">
          EdAll
        </h1>
      </div>

      {/* Main content area for login/register */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
