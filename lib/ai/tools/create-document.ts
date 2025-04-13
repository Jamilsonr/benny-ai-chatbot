import { generateUUID, truncateText } from '@/lib/utils';
import {  tool } from 'ai';
import { z } from 'zod';
import { Session } from 'next-auth';
import {
  artifactKinds,
  documentHandlersByArtifactKind,
} from '@/lib/artifacts/server';
import { getDocumentsById } from '@/lib/db/queries';
interface CreateDocumentProps {
  title: string;
  kind: z.infer<typeof artifactKinds>;
  session: Session;
}

export const createDocument = ({ session }: CreateDocumentProps) =>
  tool({
    description:
      'Create a document for writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.',
    parameters: z.object({
      title: z.string(),
      kind: z.enum(artifactKinds),
    }),
    execute: async ({ title, kind }) => {
      const id = generateUUID()

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === kind,
      );

      if (!documentHandler) {
        throw new Error(`No document handler found for kind: ${kind}`)
      }

      // RAG implementation
      let context = ""
      if (session?.user?.id) {
        const dbDocuments = await getDocumentsById({ id: session.user.id });

        // Fetch content from the specified website
        try {
          const websiteResponse = await fetch('https://bcn.cv/pt_PT/')
          const websiteContent = await websiteResponse.text()
          context += `Website Content:\n${truncateText(websiteContent, 10000)}\n\n`
        } catch (error) {
          console.error("Error fetching website content:", error);
        }

        const dbContent = dbDocuments.map(doc => truncateText(doc.content ?? "", 5000)).join('\n\n')
        context += `Database Documents:\n${dbContent}`
      }
      console.log("RAG Context:", context.length > 0 ? "Available" : "Empty");

      await documentHandler.onCreateDocument({ id, session });

      // Return the document details
      return {
        id,
        title,
        kind,
        content: `A document with id: ${id} was created and is now visible to the user.`,
      };
    },
  });
