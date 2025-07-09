import { create } from "zustand"
import { toast } from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import axios from "axios"
import { useAuthStore } from "./useAuthStore"


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("messages/user")
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isUsersLoading: false })
        }
    },
//     getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//         const res = await axiosInstance.get(`/messages/${userId}`);
//         if (res && res.data) {
//             set({ messages: res.data });
//         } else {
//             console.warn("Empty or undefined response in getMessages");
//             set({ messages: [] });
//         }
//     } catch (error) {
//         console.error("❌ getMessages error:", error);
//         toast.error(error.response?.data?.message || "Failed to load messages");
//         set({ messages: [] }); // fallback to avoid crash
//     } finally {
//         set({ isMessagesLoading: false });
//     }
// },

    getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        if (res && res.data) {
            set({ messages: res.data });
            console.log("✅ Messages fetched:", res.data);
        } else {
            console.warn("⚠️ Empty response for messages");
            set({ messages: [] });
        }
    } catch (error) {
        console.error("❌ getMessages error:", error);
        toast.error(error.response?.data?.message || "Failed to load messages");
        set({ messages: [] }); // Prevent stale data
    } finally {
        set({ isMessagesLoading: false });
    }
},

    // sendMessages:async(messageData)=>{
    //     const {selectedUser,message}=get()
    //     try {
    //         const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
    //         set({messages:[...messages,res.data]})
    //     } catch (error) {
    //         toast.error(error.response.data.message)
    //     }
    // },
    sendMessages: async (messageData) => {
        const { selectedUser, messages } = get();

        if (!selectedUser || !selectedUser._id) {
            toast.error("No user selected");
            return;
        }

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );

            if (res?.data) {
                set({ messages: [...messages, res.data] });
            } else {
                throw new Error("Empty response from server");
            }
        } catch (error) {
            console.error("Send message error:", error);
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages:()=>{
        const {selectedUser}=get()
        if(!selectedUser) return 

        const socket=useAuthStore.getState().socket
        //todo
        socket.on("newMessage",(newMessage)=>{
            const isMessageSentfromSelectedUser=newMessage.senderId==selectedUser._id
            if(!
                isMessageSentfromSelectedUser) return 
            set({
                messages:[...get().messages,newMessage],
            })
        })

    },
    unsubscribeFromMessages:()=>{
        const socket=useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser: (user) => set({ selectedUser: user })
}))