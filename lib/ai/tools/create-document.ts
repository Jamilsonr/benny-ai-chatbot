import { generateUUID } from "@/lib/utils";
import {  tool } from 'ai';
import { z } from 'zod';
import { Session } from 'next-auth';
import {
  artifactKinds,
  documentHandlersByArtifactKind,
} from '@/lib/artifacts/server';
import { getDocumentsById } from '@/lib/db/queries';
const Kinds = z.enum(["text", "code", "image", "sheet"]);
interface CreateDocumentProps {
  title: string;
  kind: z.infer<typeof Kinds>;
  session: Session
}

export const createDocument = ({ session }: CreateDocumentProps) =>
  tool({
    description:
      'Create a document for writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.',
    parameters: z.object({
      title: z.string(),
      kind: Kinds
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

      await documentHandler.onCreateDocument({ id, session, title });

      // Return the document details
      return {
        id,
        title,
        kind,
        content: `A document with id: ${id} was created and is now visible to the user.`,
      };
    },
  });
