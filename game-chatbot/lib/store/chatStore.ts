import { create } from 'zustand'

// Interface for Attachment
export interface Attachment {
    id: string
    url: string
    fileName: string
    mimeType: string
    createdAt: Date
}

// Interface for Message
export interface Message {
    id: string
    role: string // 'user' | 'assistant'
    content: string
    conversationId: string
    attachments?: Attachment[]
    createdAt: Date
    updatedAt: Date
}

// Interface for Conversations
export interface Conversations {
    id: string
    title: string
    userId: string
    messages?: Message[]
    createdAt: Date
    updatedAt: Date
    _count?: {
        messages: number
    }
}

// Interface for Chat Store
interface ChatStore {
    // State
    conversations: Conversations[]
    currentConversation: string | null
    messages: Message[]
    isLoading: boolean
    isSending: boolean

    // Actions - Conversations
    setConversations: (conversations: Conversations[]) => void
    addConversation: (conversation: Conversations) => void
    updateConversation: (id: string, data: Partial<Conversations>) => void
    removeConversation: (id: string) => void

    // Actions - Current Conversation
    setCurrentConversation: (id: string | null) => void

    // Actions - Messages
    setMessages: (messages: Message[]) => void
    addMessage: (message: Message) => void
    clearMessages: () => void

    // Actions - Loading States
    setIsLoading: (loading: boolean) => void
    setIsSending: (sending: boolean) => void

    // Action - Reset All
    reset: () => void
}

// Tạo Zustand Store
export const useChatStore = create<ChatStore>((set) => ({
    // Initial State
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoading: false,
    isSending: false,

    // Actions - Conversations
    setConversations: (conversations) =>
        set({ conversations }),

    addConversation: (conversation) =>
        set((state) => ({
            conversations: [conversation, ...state.conversations],
        })),

    updateConversation: (id, data) =>
        set((state) => ({
            conversations: state.conversations.map((conv) =>
                conv.id === id ? { ...conv, ...data } : conv
            ),
        })),

    removeConversation: (id) =>
        set((state) => ({
            conversations: state.conversations.filter((conv) => conv.id !== id),
        })),

    // Actions - Current Conversation
    setCurrentConversation: (id) =>
        set({ currentConversation: id }),

    // Actions - Messages
    setMessages: (messages) =>
        set({ messages }),

    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    clearMessages: () =>
        set({ messages: [] }),

    // Actions - Loading States
    setIsLoading: (loading) =>
        set({ isLoading: loading }),

    setIsSending: (sending) =>
        set({ isSending: sending }),

    // Action - Reset All
    reset: () =>
        set({
            conversations: [],
            currentConversation: null,
            messages: [],
            isLoading: false,
            isSending: false,
        }),
}))
