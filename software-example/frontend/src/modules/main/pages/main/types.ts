import type { NoteResponseDto } from '@/api/rest-client/dto';

export interface NoteFormValues {
  title: string;
  description?: string;
  url?: string;
}

export interface FilterFormValues {
  searchQuery?: string;
  useSemanticSearch?: boolean;
  semanticLimit?: number;
  denseWeight?: number;
  sparseWeight?: number;
  textWeight?: number;
}

export interface FilterWatchValues {
  searchQuery?: string;
  useSemanticSearch?: boolean;
  semanticLimit?: number;
  denseWeight?: number;
  sparseWeight?: number;
  textWeight?: number;
}

export interface NoteCardProps {
  note: NoteResponseDto;
  onEdit: (note: NoteResponseDto) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export interface NoteModalProps {
  isOpen: boolean;
  editingNote: NoteResponseDto | undefined;
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => void;
  isLoading?: boolean;
}

export interface FilterPanelProps {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  form: import('antd').FormInstance<FilterFormValues>;
  onApply: () => void;
  onReset: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export interface NotesListProps {
  notes: NoteResponseDto[];
  onEdit: (note: NoteResponseDto) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize?: number) => void;
  isLoading?: boolean;
}
