import { getCorsair } from "@/server/corsair";
/* eslint-disable @typescript-eslint/no-explicit-any */

export class GmailService {
  static async getMessages(sessionUserEmail: string) {
    const c = getCorsair(sessionUserEmail);

    const list = await (c as any).gmail.api.messages.list({
      maxResults: 25,
      labelIds: ["INBOX"],
    });

    const messages = list?.messages || list || [];

    const detailedMessages = await Promise.all(
      messages.map(async (msg: any) => {
        try {
          return await (c as any).gmail.api.messages.get({
            id: msg.id,
            format: "full",
          });
        } catch (err) {
          console.error("Message fetch error:", err);
          return null;
        }
      })
    );

    return detailedMessages.filter(Boolean);
  }

  static async getMessage(sessionUserEmail: string, id: string) {
    const c = getCorsair(sessionUserEmail);

    return await (c as any).gmail.api.messages.get({
      id,
      format: "full",
    });
  }

  static async sendEmail(
    sessionUserEmail: string,
    to: string,
    subject: string,
    body: string
  ) {
    const c = getCorsair(sessionUserEmail);

    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      body,
    ].join("\r\n");

    const raw = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return await (c as any).gmail.api.messages.send({
      raw,
    });
  }
}