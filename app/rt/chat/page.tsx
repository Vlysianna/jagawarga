import dynamic from "next/dynamic";

const ChatWorkspace = dynamic(() => import("@/components/chat/ChatWorkspace"), {
  ssr: true,
});

function getInitialMode(mode?: string) {
  return mode === "private" || mode === "rt" ? mode : "all";
}

export default async function RTChatPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = getInitialMode(mode);

  return <ChatWorkspace key={initialMode} initialMode={initialMode} />;
}
