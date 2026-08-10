import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { GET_BAND_MESSAGES } from "../graphql/queries";
import { ISSUE_WS_TICKET, SEND_MESSAGE } from "../graphql/mutations";
import { BAND_MESSAGE_ADDED } from "../graphql/subscriptions";
import { GetBandMessagesQuery } from "../gql/graphql";
import { useAuth } from "../auth/AuthContext";
import { FIELD_MAX } from "../constants/validation";

type ChatMessage = GetBandMessagesQuery["bandMessages"][number];

export default function BandChat({ bandId }: { bandId: string }) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [ticket, setTicket] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, loading } = useQuery(GET_BAND_MESSAGES, {
    variables: { bandId, limit: 50 },
  });

  const [issueWsTicket] = useMutation(ISSUE_WS_TICKET);

  useEffect(() => {
    issueWsTicket().then(({ data: ticketData }) => {
      if (ticketData?.issueWsTicket) setTicket(ticketData.issueWsTicket);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bandId]);

  useSubscription(BAND_MESSAGE_ADDED, {
    variables: { bandId, ticket: ticket ?? "" },
    skip: !ticket,
    onData: ({ data: subData }) => {
      const message = subData.data?.messageAdded;
      if (message) setLiveMessages((current) => [...current, message]);
    },
    onError: (error) => {
      console.error("Band chat subscription error:", error);
    },
  });

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE);

  const history = data?.bandMessages ?? [];
  const allMessages = [...history, ...liveMessages];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    await sendMessage({ variables: { bandId, body } });
    setBody("");
  };

  if (loading) return <p className="empty-state">Loading chat...</p>;

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {allMessages.length === 0 && <p className="empty-state">No messages yet. Say hello.</p>}
        {allMessages.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.sender.id === user?.id ? "own" : ""}`}>
            <span className="chat-sender">{m.sender.name}</span>
            <p>{m.body}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="chat-input-row">
        <input
          className="form-input"
          placeholder="Message the band..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={FIELD_MAX.chatBody}
        />
        <button type="submit" className="small-button" disabled={sending || !body.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
