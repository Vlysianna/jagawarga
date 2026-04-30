import ChatWorkspace from "@/components/chat/ChatWorkspace";

function getInitialMode(mode?: string) {
  return mode === "private" || mode === "rt" ? mode : "all";
}

export default async function KecChatPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = getInitialMode(mode);

  return <ChatWorkspace key={initialMode} initialMode={initialMode} />;
}
