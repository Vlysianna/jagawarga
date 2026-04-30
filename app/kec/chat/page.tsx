import dynamic from "next/dynamic";

const ChatWorkspace = dynamic(() => import("@/components/chat/ChatWorkspace"), {
  ssr: false,
});

export default function KecChatPage() {
  return <ChatWorkspace />;
}
