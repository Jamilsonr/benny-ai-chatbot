import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    // Verifica se a requisição possui um corpo válido
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Entrada inválida: "messages" deve ser um array.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Cria a stream a partir do modelo DeepSeek (com suporte a raciocínio)
    const result = streamText({
      model: deepseek('deepseek-reasoner'),
      messages,
      // Aqui você pode incluir outros parâmetros (ex.: temperature, maxTokens, etc.) se necessário
    });

    // Retorna a resposta em formato de DataStream, encaminhando os tokens de raciocínio
    return result.toDataStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    console.error('Erro no endpoint de chat:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
