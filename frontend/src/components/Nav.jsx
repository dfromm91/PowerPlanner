import { NavLink } from "react-router-dom";

function Nav({ setLoggedIn }) {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/users/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/powerplanner";
        setLoggedIn(false);
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.error);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md w-full px-6">
      <div className="container mx-auto h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="text-3xl font-bold text-indigo-600">PowerPlanner</div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-gray-600 font-medium">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-indigo-600 font-semibold underline underline-offset-4"
                : "hover:text-indigo-500 transition"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/rewards"
            className={({ isActive }) =>
              isActive
                ? "text-indigo-600 font-semibold underline underline-offset-4"
                : "hover:text-indigo-500 transition"
            }
          >
            Rewards
          </NavLink>
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              isActive
                ? "text-indigo-600 font-semibold underline underline-offset-4"
                : "hover:text-indigo-500 transition"
            }
          >
            Friends
          </NavLink>
        </div>

        {/* Logout Button */}
        <div>
          <button
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-sm transition-shadow hover:shadow-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
