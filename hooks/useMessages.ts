"use client";

import { useMemo, useState } from "react";
import { Message } from "@/generated/prisma/client";
import { isSameDay as sameDay } from "@/lib/isSameDay";

const WINDOW_SIZE = 200;
const WINDOW_INCREMENT = 200;

export function useMessages(messages: Message[] | null) {
  // 1) windowing
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(WINDOW_SIZE, messages?.length ?? 0)
  );

  const visibleMessages = useMemo(() => {
    if (!messages) return [];
    return messages.slice(Math.max(0, messages.length - visibleCount));
  }, [messages, visibleCount]);

  // 2) enhanced metadata
  const enhancedMessages = useMemo(() => {
    return visibleMessages.map((msg, i) => {
      const prev = visibleMessages[i - 1];
      const isSameSender = !!prev && prev.senderId === msg.senderId;
      const isSameDay = !!prev && sameDay(new Date(prev.createdAt), new Date(msg.createdAt));
      const showDateBadge = !prev || !isSameDay;

      return {
        ...msg,
        isSameSender,
        showDateBadge,
      };
    });
  }, [visibleMessages]);

  // 3) load older messages
  const loadOlderMessages = () => {
    if (!messages) return;
    if (visibleCount >= messages.length) return;

    setVisibleCount(prev =>
      Math.min(messages.length, prev + WINDOW_INCREMENT)
    );
  };

  return {
    enhancedMessages,
    loadOlderMessages,
  };
}