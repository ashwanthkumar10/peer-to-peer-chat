import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // If no user is selected, return a placeholder
  if (!selectedUser) {
    return (
      <div className="p-2.5 border-b border-[#D9DCE0] flex items-center">
        <p className="text-gray-500">Select a user to chat</p>
      </div>
    );
  }

  return (
    <div className="p-2.5 border-b border-[#D9DCE0]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="size-10 rounded-full overflow-hidden">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName || "User"}
              className="object-cover w-full h-full"
            />
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName || "Unknown"}</h3>
            <p className="text-sm text-gray-500">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
