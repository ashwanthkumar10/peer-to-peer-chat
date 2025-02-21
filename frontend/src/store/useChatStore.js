import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    isSidebarOpen: false,  // Controls the left sidebar
    isProfileOpen: false,  // Controls the right sidebar

    // Fetch the users
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // Fetch messages for a specific user
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // Send a message
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending message");
        }
    },

    // Subscribe to messages
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageFromSelectedUser) return;
            set({ messages: [...get().messages, newMessage] });
        });
    },

    // Unsubscribe from messages
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    // Set the selected user & open profile sidebar
    setSelectedUser: (selectedUser) => {
        set({ selectedUser, isProfileOpen: true });
    },

    // Close the right sidebar (ChatProfileDetails)
    closeProfileSidebar: () => {
        set({ isProfileOpen: false });
    },

    // Close the left sidebar (Sidebar)
    closeSidebar: () => {
        set({ isSidebarOpen: false });
    },
}));
