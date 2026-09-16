'use client';

import { Empty, Flex } from 'antd';
import { memo } from 'react';

import NoteCard from '../note-card';
import type { NotesListProps } from './type';

export const NotesList = memo(({ isDeleting, notes, onDelete, onEdit }: NotesListProps) => {
  if (notes.length === 0) {
    return <Empty description="У вас пока нет заметок" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <Flex className="main-page__notes-list">
      {notes.map((note) => (
        <NoteCard key={note.id} isDeleting={isDeleting} note={note} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </Flex>
  );
});

NotesList.displayName = 'NotesList';

export default NotesList;
