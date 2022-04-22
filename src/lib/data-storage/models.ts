export interface IRequest {
  id?: number;
  title: string;
  body: string;
  created_at?: Date;
  position?: string;
}

export interface IComment {
  id?: number;
  username: string;
  text: string;
  request_id: number;
  created_at?: Date;
}
