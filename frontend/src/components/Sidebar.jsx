import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
  const { getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  // Filter users based on search term, ensuring fullName is always a string
  const filteredUsers = users.filter((user) =>
    (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Sidebar Section */}
      <aside className="h-full w-20 lg:w-72 border-r border-gray-300 flex flex-col transition-all duration-200">
        
        {/* Top Section with Logo */}
        <div className="border-b border-gray-300 w-full px-5 py-3 flex items-center">
          <div className="w-17 h-10 flex-shrink-0">
            <img
              src="/image 66.png" // Replace with actual image path
              alt="Chat Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2 border-b flex items-center">
          <div className="relative w-full">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
              <img
                src="/Vector (1).png" // Replace with actual image path
                alt="Search"
                className="w-6 h-6 object-contain"
              />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-10 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            )}
          </div>
        </div>

        {/* User List */}
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-gray-200 transition-colors ${
                  selectedUser?._id === user._id ? "bg-gray-200 ring-1 ring-gray-300" : ""
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName || "User"}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>

                {/* User Info (Hidden on Small Screens) */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate text-gray-800">{user.fullName || "Unknown"}</div>
                  <div className="text-sm text-gray-500">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No users found</div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
