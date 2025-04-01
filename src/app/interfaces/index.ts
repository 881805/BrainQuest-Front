export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
  message: string,
  meta: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRoleType {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN'
}

export interface IRole {
  createdAt: string;
  description: string;
  id: number;
  name : string;
  updatedAt: string;
}

export interface IGame {
  id?: number;
  conversation?: IConversation | null;
  winner?: IUser;
  question?: ITriviaQuestion | null;
  gameType?: IGameType;
  isOngoing?: boolean;
  pointsEarnedPlayer1?: number;
  pointsEarnedPlayer2?: number;
}

export interface IConversation {
  id?: number;
  user1?: IUser;
  user2?: IUser | null;
  createDate?: string;
  isMultiplayer?: boolean;
  messages?: IMessage[];
}

export interface IGameType {
  id?: number;
  gameType?: GameTypeEnum;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum GameTypeEnum {
  TRIVIA = 'TRIVIA',
  DEBATE = 'DEBATE',
  MULTIPLAYER_DEBATE = 'MULTIPLAYER_DEBATE',
  INTERVIEW = 'INTERVIEW',
  STORYBUILDER = 'STORYBUILDER'
}

export interface IMessage {
  id: number;
  conversation: IConversation;
  contentText: string;
  createdAt: Date;
  user: IUser;
  isSent: boolean;
}

export interface ITriviaQuestion {
  id?: number;
  question?: string;
  correctAnswer?: string;
  options?: string[];
  difficulty?: string;
  category?: string;
}

export interface IOrder {
  id?: number;
  description?: string;
  total?: number;
}

export interface ISearch {
  page?: number;
  size?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?:number;
}

export interface IMovie {
  id?: number;
  title?: string;
  director?: string;
  description?: string;
}

export interface IPreferenceList {
  id?: number;
  name?: string;
  movies?: IMovie[];
}

export interface ITriviaQuestion {
  id: number; 
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
  points: number;
  userAnswer?: string;
}
