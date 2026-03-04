import Header from "@/components/Header";
import ChatInput from "@/components/ChatInput";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <Header/>
            <ChatInput/>
        </main>
    );
}
