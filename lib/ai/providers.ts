import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
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
        'chat-model': deepseek('deepseek-chat'),
        'chat-model-reasoning': wrapLanguageModel({
          model: deepseek('deepseek-chat'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'deepseek-model': deepseek('deepseek-chat'),
        'title-model': deepseek('deepseek-chat'),
        'artifact-model': deepseek('deepseek-chat'),
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
