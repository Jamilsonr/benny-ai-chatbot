'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Abrir Conta',
      label: 'Como posso abrir uma conta no BCN?',
      action: 'Como posso abrir uma conta no BCN?',
    },
    {
      title: 'Taxa de Juros',
      label: 'Qual a taxa de juros para financiamento imobiliário?',
      action: 'Qual a taxa de juros para financiamento imobiliário no BCN?',
    },
    {
      title: 'Produtos e Serviços',
      label: 'Quais produtos e serviços o banco oferece?',
      action: 'Liste e explique os produtos e serviços oferecidos pelo Banco BCN.',
    },
    {
      title: 'Investimentos',
      label: 'Quais opções de investimentos estão disponíveis?',
      action: 'Detalhe as opções de investimento e produtos financeiros do Banco BCN.',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
