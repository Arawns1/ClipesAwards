import { Attachment, Message } from "discord.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getCursors, getMessagesFromClipsChannel } from "src/ws/get-all-clips";
import vote from "models/Vote";
import Comment from "models/Comment";
import { InternalServerError } from "src/errors";

type GetAllClipsRequest = FastifyRequest<{
  Querystring: { cursor: string | null; direction: DirectionCursor };
}> & { user?: { id: string } };
export type MessageWithAttachment = {
  message: Message;
  attachment: Attachment;
};
export type DirectionCursor = "forward" | "backward";

export async function getAllClips(app: FastifyInstance) {
  app.get("/", async (req: GetAllClipsRequest, res: FastifyReply) => {
    console.group("[getAllClips]");
    console.log(`[INFO] Requisição recebida`);
    try {
      const { cursor, direction } = req.query;
      const FETCH_SIZE = 9;
      // const period = {
      //   startDate: new Date(new Date().getFullYear(), 0, 1), // 01/01/2024
      //   endDate: new Date(new Date().getFullYear(), 11, 31, 23, 59, 59), // 31/12/2025
      // };

      const messages = await getMessagesFromClipsChannel(
        cursor,
        FETCH_SIZE,
        direction,
      );

      const clips = await Promise.all(
        messages.map(async (mes) => await mapMessageToClips(mes, req.user)),
      );

      const cursors = await getCursors(messages, FETCH_SIZE, direction);

      const responseBody = {
        nextCursor: cursors.nextCursor,
        data: clips,
      };

      return res.code(200).send(responseBody);
    } catch (err) {
      console.error("[ERROR] Erro interno: ", err);
      err = new InternalServerError(err);
      return res.code(err.statusCode).send(err);
    } finally {
      console.info(`[INFO] Requisição finalizada`);
      console.groupEnd();
    }
  });
}

async function mapMessageToClips(
  messageProps: MessageWithAttachment,
  user?: { id: string },
) {
  const { message, attachment } = messageProps;

  const { createdTimestamp, author } = message;
  const clipId = attachment.id;
  let previousVote;

  if (user) {
    previousVote = await vote.findOneById(
      { userId: user.id, clipId },
      { throwable: false },
    );
  }

  const [totalVotes, totalComments] = await Promise.all([
    vote.getTotalVotes(clipId),
    Comment.countCommentsByClipId(clipId),
  ]);

  return {
    clip_id: clipId,
    posted_at: new Date(createdTimestamp).toISOString(),
    video_src: attachment.url,
    user: {
      username: author.globalName,
      avatar_url: author.avatarURL(),
    },
    previous_user_vote: previousVote?.vote_type || null,
    total_votes: totalVotes,
    total_comments: totalComments,
  };
}
