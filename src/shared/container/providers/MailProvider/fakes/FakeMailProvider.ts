import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface Message {
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvider {
  private message: Message[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.message.push({
      to,
      body,
    });
  }
}
