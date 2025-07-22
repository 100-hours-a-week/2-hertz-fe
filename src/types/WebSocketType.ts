export type InitUserMessage = number;

export interface ReceiveMessage {
  roomId: number;
  senderId: number;
  message: string;
  sendAt: string;
  messageId?: number;
}

export interface SendMessage {
  roomId: number;
  receiverUserId: number;
  message: string;
  sendAt: string;
  messageId?: number;
}

export interface MarkAsRead {
  roomId: number;
}

// 서버 → 클라이언트
export type WebSocketIncomingMessage =
  | { event: 'init_user'; data: InitUserMessage }
  | { event: 'receive_message'; data: ReceiveMessage };

// 클라이언트 → 서버
export type WebSocketOutgoingMessage =
  | { event: 'send_message'; data: SendMessage }
  | { event: 'mark_as_read'; data: MarkAsRead };
