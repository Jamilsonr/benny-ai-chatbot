export const DEFAULT_CHAT_MODEL: string = 'deepseek-model';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'deepseek-model',
    name: 'Deepseek R1',
    description: 'Modelo deepseek-reasoner R1',
  },
];
