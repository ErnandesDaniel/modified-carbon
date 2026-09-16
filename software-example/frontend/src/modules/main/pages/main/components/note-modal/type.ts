import { type FormInstance } from 'antd';

import type { NoteFormValues } from '@/modules/main/pages/main/types';

export interface NoteModalProps {
  isOpen: boolean;
  editingNote: { id: number; title: string; description?: string; url?: string } | undefined;
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => void;
  isLoading?: boolean;
  form: FormInstance<NoteFormValues>;
}
