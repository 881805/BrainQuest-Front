export interface ILoginResponse {
  accessToken: string;
  expiresIn: number;
  token: string;
  authUser: IUser;
}

export interface IResponse<T> {
  data: T;
  message: string,
  meta: T;
}


export interface IMission{
  id?: number;
  createdAt?: Date;
  createdBy?: IUser;
  startDate?: Date;
  endDate?: Date;
  isDaily?: boolean;
  isActive?: boolean;
  objective?: IObjective;
  experience? : number;
  gameType? : IGameType;
}


export interface IMissionXUser {
  id?: number;
  user?: IUser;
  mission?: IMission;
  isCompleted?: boolean;
  completedAt?: Date;
  lastUpdated?: Date;
  progress?: number;
}

export interface IObjective{
  id?: number;
  ammountSuccesses?: number;
  scoreCondition? : number;
  objectiveText? : string;
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
  expirationTime?: string | null; 
  timeLeft?: number;
  maxTurns?: number;
  elapsedTurns?: number;
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
export interface ITypingExercise {
  id: number;
  text: string;
  timeLimit: number;
  hints: string[];
  category: string;
  difficulty: string;
  userInput?: string;
  completed?: boolean;
}

export enum GameTypeEnum {
  TRIVIA = 'TRIVIA',
  DEBATE = 'DEBATE',
  MULTIPLAYER_DEBATE = 'MULTIPLAYER_DEBATE',
  INTERVIEW = 'INTERVIEW',
  STORYBUILDER = 'STORYBUILDER'
}

export interface IMessage {
  id?: number;
  conversation: IConversation;
  contentText: string;
  createdAt: Date;
  user: IUser;
  isSent: boolean;
}

export interface ITriviaQuestion {
  id?: number; 
  question?: string;
  options?: string[];
  correctAnswer?: string;
  category?: string;
  difficulty?: string;
  points?: number;
  userAnswer?: string;
  feedback?: string; 
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


export interface ActivityCard {
  icon: any;
  title: string;
  description: string;
  buttonColor: string;
  iconBgColor: string;
}

export interface Challenge {
  title: string;
  description: string;
  level: string;
  duration: string;
  participantsOrRecord: string;
  buttonColor: string;
  buttonText: string;
}

export interface ITypingExercise {
  id: number;
  text: string;
  timeLimit: number;
  hints: string[];
  category: string;
  difficulty: string;
  userInput?: string;
  completed?: boolean;
}

export interface IAiConfiguration {
  id: number;
  configuracion: string;
  createdAt: string;
}



