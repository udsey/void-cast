import { useEffect, useCallback, use } from "react";
import { api } from "../services/api.js";

export function useSSE(onNewCast) {
  const connect = useCallback(() => {
    const eventSource = new EventSource(api.getSSEUrl());

    eventSource.onopen = () => {
      console.log('✅ SSE connected')
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // ignore initial connection ping
      if (data.type === 'connected') return;

      onNewCast(data);
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE error:', error);
      eventSource.close();
      // attempt to reconnect after a delay
      setTimeout(connect, 3000);
    };

    return eventSource;
  }, [onNewCast]);

  useEffect(() => {
    const eventSource = connect();

    // cleanup on unmount
    return () => {
      console.log('🔌 SSE disconnected')
      eventSource?.close();
    }
  }, [connect]);
}
