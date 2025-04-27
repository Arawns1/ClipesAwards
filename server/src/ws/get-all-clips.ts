import { Collection, FetchMessagesOptions, Message } from "discord.js";
import { ID_CANAL_CLIPES } from "src/constants";
import {
  DirectionCursor,
  MessageWithAttachment,
} from "src/http/routes/clips/get-all-clips";
import { client } from "./bot";
import {
  filterByAttachmentType,
  filterHasAttachments,
  MessageFilter,
} from "./utils/filters";
import { getTextChannel } from "./utils/getTextChannel";

export type Period = {
  startDate: Date;
  endDate: Date;
};

type MessageId = string;
type MessagePage = Collection<MessageId, Message>;

export async function getMessagesFromClipsChannel(
  cursor: string | null,
  fetchSize = 9,
  direction: DirectionCursor = "forward",
  period?: Period,
) {
  const channel = getTextChannel(client, ID_CANAL_CLIPES);
  const filters: MessageFilter[] = [
    // filterByDate(startDateFilter, endDateFilter), // Filtra por data
    filterHasAttachments, // Filtra por anexos
    filterByAttachmentType("video/"), // Filtra por vídeos
  ];

  const fetchOptions = buildFetchOptions(cursor, direction, fetchSize);
  const messagePage: MessagePage = await channel.messages.fetch(fetchOptions);
  const sortedMessages = sortMessages(messagePage, direction);
  const messages = collectValidMessages(sortedMessages, filters, fetchSize);
  return direction == "backward" ? messages.reverse() : messages;
}

function sortMessages(
  messagePage: MessagePage,
  direction: DirectionCursor,
): MessagePage {
  if (direction == "backward") {
    return messagePage.reverse();
  }
  return messagePage;
}

function buildFetchOptions(
  cursor: string | null,
  direction: DirectionCursor,
  fetchSize: number,
): FetchMessagesOptions {
  const fetchOptions: FetchMessagesOptions = {
    limit: fetchSize * 2,
  };

  if (cursor) {
    if (direction === "forward") {
      fetchOptions.before = cursor;
    }
    if (direction === "backward") {
      fetchOptions.after = cursor;
    }
  }

  return fetchOptions;
}

function collectValidMessages(
  messagePage: MessagePage,
  filters: MessageFilter[],
  fetchSize: number,
): MessageWithAttachment[] {
  const collectedMessages: MessageWithAttachment[] = [];
  let distinctMessageCount = 0;

  for (const message of messagePage.values()) {
    if (distinctMessageCount >= fetchSize) break;

    const isValidMessage = filters.every((filter) => filter(message));
    if (!isValidMessage) continue;

    distinctMessageCount++;

    message.attachments.forEach((attachment) => {
      collectedMessages.push({ message, attachment });
    });
  }

  return collectedMessages;
}

export async function getCursors(
  messages: MessageWithAttachment[],
  fetchSize: number,
  direction: DirectionCursor = "forward",
) {
  const getCursorId = (
    messageArray: MessageWithAttachment[],
    position: "first" | "last",
  ) => {
    const message =
      position === "first"
        ? messageArray[0]
        : messageArray[messageArray.length - 1];
    return message?.message.id || null;
  };

  const getNextCursor = async (
    messages: MessageWithAttachment[],
    fetchSize: number,
    direction: DirectionCursor,
  ): Promise<string | null> => {
    if (!messages.length) return null;

    if (direction === "backward") {
      const lastMessageId = getCursorId(messages, "last");
      if (!lastMessageId) return null;
      return lastMessageId;
    } else {
      const lastMessageId = getCursorId(messages, "last");
      if (!lastMessageId) return null;

      const result = await getMessagesFromClipsChannel(
        lastMessageId,
        fetchSize,
        "forward",
      );
      return result.length ? lastMessageId : null;
    }
  };

  // const getPrevCursor = async (
  //   messages: MessageWithAttachment[],
  //   direction: DirectionCursor,
  // ): Promise<string | null> => {
  //   if (!messages.length) return null;

  //   if (direction === "backward") {
  //     const firstMessageId = getCursorId(messages, "first");
  //     if (!firstMessageId) return null;

  //     const result = await getMessagesFromClipsChannel(
  //       firstMessageId,
  //       fetchSize,
  //       "backward",
  //     );
  //     return result.length ? firstMessageId : null;
  //   } else {
  //     const firstMessageId = getCursorId(messages, "first");
  //     if (!firstMessageId) return null;

  //     const result = await getMessagesFromClipsChannel(
  //       firstMessageId,
  //       fetchSize,
  //       "backward",
  //     );
  //     return result.length ? firstMessageId : null;
  //   }
  // };

  // const [nextCursor, prevCursor] = await Promise.all([
  //   getNextCursor(messages, direction),
  //   getPrevCursor(messages, direction),
  // ]);

  // return { prevCursor, nextCursor };
  const nextCursor = await getNextCursor(messages, fetchSize, direction);
  return { nextCursor };
}
