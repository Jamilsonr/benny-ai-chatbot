import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('Mensagens recebidas:', messages);

    const result = streamText({
      model: deepseek('deepseek-reasoner'),
      messages,
    });

    return result.toDataStreamResponse({
      sendReasoning: true,
    });

  } catch (error: any) {
    console.error('Erro ao chamar Deepseek:', error);

    // Retorna uma resposta de erro mais clara pro frontend
    return new Response(
      JSON.stringify({ error: error?.message || 'Erro desconhecido' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
