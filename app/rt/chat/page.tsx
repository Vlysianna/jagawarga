import dynamic from "next/dynamic";

const ChatWorkspace = dynamic(() => import("@/components/chat/ChatWorkspace"), {
  ssr: true,
});

export default function RTChatPage() {
  return <ChatWorkspace />;
}
