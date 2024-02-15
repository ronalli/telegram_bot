import { Context, SessionFlavor} from 'grammy';
import {
  type Conversation,
  type ConversationFlavor,
} from '@grammyjs/conversations';

export interface SessionData {
  auth: boolean;
  info: string;
}

export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor;
	
export type MyConversation = Conversation<MyContext>;