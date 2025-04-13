diff
--- a/lib/artifacts/server.ts
+++ b/lib/artifacts/server.ts
@@ -4,7 +4,6 @@
 import { sheetDocumentHandler } from '@/artifacts/sheet/server';
 import { textDocumentHandler } from '@/artifacts/text/server';
 import { ArtifactKind } from '@/components/artifact';
-import { DataStreamWriter } from 'ai';
 import { Document } from '../db/schema';
 import { saveDocument } from '../db/queries';
 import { Session } from 'next-auth';
@@ -16,7 +15,6 @@
 export interface CreateDocumentCallbackProps {
   id: string;
   title: string;
-  dataStream: DataStreamWriter;
   session: Session;
 }
 
@@ -24,7 +22,6 @@
 export interface UpdateDocumentCallbackProps {
   document: Document;
   description: string;
-  dataStream: DataStreamWriter;
   session: Session;
 }
 
@@ -47,7 +44,6 @@
       const draftContent = await config.onCreateDocument({
         id: args.id,
         title: args.title,
-        dataStream: args.dataStream,
         session: args.session,
       });
 
@@ -67,6 +63,5 @@
       const draftContent = await config.onUpdateDocument({
         document: args.document,
         description: args.description,
-        dataStream: args.dataStream,
         session: args.session,
       });