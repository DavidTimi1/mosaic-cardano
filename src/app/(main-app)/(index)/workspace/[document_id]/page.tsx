import React from 'react';
import WorkspaceEditorClient from './WorkspaceEditorClient';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ document_id: string }> }): Promise<Metadata> {
  const { document_id } = await params;
  if (document_id === 'new') {
    return { title: 'New Draft | Mosaic Workspace' };
  }
  return { title: 'Mosaic Workspace' };
}

export default async function WorkspacePage({ params }: { params: Promise<{ document_id: string }> }) {
  const { document_id } = await params;

  return (
    <WorkspaceEditorClient 
      documentId={document_id}
    />
  );
}
