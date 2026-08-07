import React, { useEffect, useState } from "react";
import { useApolloClient, useMutation, useSubscription } from "@apollo/client/react";
import { ISSUE_WS_TICKET } from "../graphql/mutations";
import { GET_ME, GET_BAND, GET_BAND_JOIN_REQUESTS, GET_USER_JOIN_REQUESTS } from "../graphql/queries";
import { NOTIFICATIONS } from "../graphql/subscriptions";
import { useAuth } from "../auth/AuthContext";

type Toast = { id: string; message: string };

const TOAST_LIFETIME_MS = 6000;

export default function NotificationListener() {
  const { user } = useAuth();
  const client = useApolloClient();
  const [ticket, setTicket] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [issueWsTicket] = useMutation(ISSUE_WS_TICKET);

  useEffect(() => {
    if (!user) {
      setTicket(null);
      return;
    }
    issueWsTicket().then(({ data }) => {
      if (data?.issueWsTicket) setTicket(data.issueWsTicket);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useSubscription(NOTIFICATIONS, {
    variables: { ticket: ticket ?? "" },
    skip: !ticket,
    onData: ({ data }) => {
      const notification = data.data?.notifications;
      if (!notification) return;

      // Evict so any query not currently mounted is forced to hit the
      // network next time it mounts, instead of serving stale cache-first
      // data -- refetchQueries below only reaches queries active right now.
      client.cache.evict({ fieldName: "bandJoinRequests" });
      client.cache.evict({ fieldName: "userJoinRequests" });
      client.cache.evict({ fieldName: "band" });
      client.cache.evict({ fieldName: "me" });
      client.cache.gc();
      client.refetchQueries({ include: [GET_ME, GET_USER_JOIN_REQUESTS, GET_BAND_JOIN_REQUESTS, GET_BAND] });

      setToasts((current) => [...current, { id: notification.id, message: notification.message }]);
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== notification.id));
      }, TOAST_LIFETIME_MS);
    },
    onError: (error) => {
      console.error("Notification subscription error:", error);
    },
  });

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" onClick={() => setToasts((current) => current.filter((t) => t.id !== toast.id))}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
