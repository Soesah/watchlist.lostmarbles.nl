import { StringUtil } from '../core/util/StringUtil';

export enum MessageType {
  Info,
  Success,
  Warning,
  Error
}

export interface Message {
  id: string;
  type: MessageType;
  text: string;
}

const InfoDelay = 2000;
const SuccessDelay = 2500;
const WarningDelay = 5000;

class MessageService {
  private messages: Message[] = [];

  public addMessage(message: Message): Message[] {
    message.id = StringUtil.hashify(message.text);

    this.messages = [...this.messages, message];

    switch (message.type) {
      case MessageType.Info:
        setTimeout(() => this.removeMessage(message.id), InfoDelay);
        break;
      case MessageType.Success:
        setTimeout(() => this.removeMessage(message.id), SuccessDelay);
        break;
      case MessageType.Warning:
        setTimeout(() => this.removeMessage(message.id), WarningDelay);
        break;
    }

    return this.messages;
  }

  public removeMessage(id: string): Message[] {
    const index = this.messages.findIndex(
      (message: Message) => message.id === id
    );
    this.messages.splice(index, 1);

    return this.messages;
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public getLastMessage(): Message {
    return this.getMessages()[this.getMessages().length - 1];
  }
}

export default new MessageService();
