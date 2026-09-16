import type { NoteResponseDto } from '@/api/rest-client/dto';

export interface NotesListProps {
  notes: NoteResponseDto[];
  onEdit: (note: NoteResponseDto) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}
