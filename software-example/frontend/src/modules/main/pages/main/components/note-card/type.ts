import type { NoteResponseDto } from '@/api/rest-client/dto';

export interface NoteCardProps {
  note: NoteResponseDto;
  onEdit: (note: NoteResponseDto) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}
