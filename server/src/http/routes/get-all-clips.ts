import { Attachment, Message } from "discord.js";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { BASE_URL } from "src/constants";
import { getMessagesFromClipsChannel } from "src/ws/get-all-clips";

export async function getAllClips(app: FastifyInstance) {
  app.get("/clips", async (req: FastifyRequest, res: FastifyReply) => {
    console.group("[getAllClips]");
    console.log(`[INFO] Requisição recebida`);
    try {
      const messages = await getMessagesFromClipsChannel();
      const clips = messages.map((message) => mapMessageToClips(message, req));

      return res.code(200).send(clips);
    } catch (err) {
      console.error("[ERROR] Erro interno: ", err);
      return res
        .code(500)
        .send({ error: "Erro interno. Tente novamente mais tarde" });
    } finally {
      console.info(`[INFO] Requisição finalizada`);
      console.groupEnd();
    }
  });
}

type MessageWithAttachment = Message & {
  attachment: Attachment;
};
function mapMessageToClips(message: MessageWithAttachment) {
  const { createdTimestamp, author, attachment } = message;

  return {
    clip_id: attachment.id,
    posted_at: new Date(createdTimestamp).toISOString(),
    video_src: generateProxyVideoURL(attachment.url),
    user: {
      name: author.globalName,
      avatar_url: author.avatarURL(),
    },
  };
}

function generateProxyVideoURL(rawVideoURL: string) {
  const encodedAttachmentUrl = encodeURIComponent(rawVideoURL);
  const proxyUrl = `${BASE_URL}/api/proxy?url=${encodedAttachmentUrl}`;
  return proxyUrl;
}
