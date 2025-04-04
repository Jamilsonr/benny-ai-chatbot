import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { deepseek } from '@ai-sdk/deepseek';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': deepseek('deepseek-chat', { apiKey: 'sk-2e279662581b49da98fb09e3cb5b7ac6' }),
        'chat-model-reasoning': wrapLanguageModel({
          model: deepseek('deepseek-chat', { apiKey: 'sk-2e279662581b49da98fb09e3cb5b7ac6' }),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': deepseek('deepseek-chat', { apiKey: 'sk-2e279662581b49da98fb09e3cb5b7ac6' }),
        'artifact-model': deepseek('deepseek-chat', { apiKey: 'sk-2e279662581b49da98fb09e3cb5b7ac6' }),
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
