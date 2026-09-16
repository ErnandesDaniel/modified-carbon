import { useQueryClient } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { useCallback, useState } from 'react';
import { useBoolean } from 'usehooks-ts';

import { getGetNotesListQueryKey, useCreateNote, useUpdateNote } from '@/api/rest-client';
import type { NoteResponseDto } from '@/api/rest-client/dto';
import type { NoteFormValues } from '@/modules/main/pages/main/types';

const DEFAULT_SEARCH_PARAMS = {
  denseWeight: 0.5,
  searchQuery: undefined as string | undefined,
  semanticLimit: undefined as number | undefined,
  sparseWeight: 0.3,
  textWeight: 0.2,
  useSemanticSearch: false
};

export const useNotesPage = () => {
  const queryClient = useQueryClient();
  const { setFalse: closeModal, setTrue: openModal, value: isModalOpen } = useBoolean(false);
  const [editingNote, setEditingNote] = useState<NoteResponseDto | undefined>();
  const [createForm] = Form.useForm<NoteFormValues>();
  const [searchParams, setSearchParams] = useState(DEFAULT_SEARCH_PARAMS);

  const createNoteMutation = useCreateNote({
    mutation: {
      onError: (error: Error) => {
        message.error('Ошибка при создании заметки');
        console.error(error);
      },
      onSuccess: () => {
        message.success('Заметка успешно создана');
        void queryClient.invalidateQueries({ queryKey: getGetNotesListQueryKey() });
        createForm.resetFields();
        closeModal();
      }
    }
  });

  const updateNoteMutation = useUpdateNote({
    mutation: {
      onError: (error: Error) => {
        message.error('Ошибка при обновлении заметки');
        console.error(error);
      },
      onSuccess: () => {
        message.success('Заметка успешно обновлена');
        void queryClient.invalidateQueries({ queryKey: getGetNotesListQueryKey() });
        setEditingNote(undefined);
        createForm.resetFields();
        closeModal();
      }
    }
  });

  const handleFilterChange = useCallback(
    (
      searchQuery: string | undefined,
      useSemanticSearch: boolean,
      semanticLimit: number | undefined,
      denseWeight: number,
      sparseWeight: number,
      textWeight: number
    ) => {
      setSearchParams({
        denseWeight,
        searchQuery,
        semanticLimit,
        sparseWeight,
        textWeight,
        useSemanticSearch
      });
    },
    []
  );

  const handleAddNote = useCallback(() => {
    setEditingNote(undefined);
    createForm.resetFields();
    openModal();
  }, [createForm, openModal]);

  const handleEdit = useCallback(
    (note: NoteResponseDto) => {
      setEditingNote(note);
      createForm.setFieldsValue({
        description: note.description,
        title: note.title,
        url: note.url
      });
      openModal();
    },
    [createForm, openModal]
  );

  const handleSubmit = useCallback(
    (values: NoteFormValues) => {
      const payload = {
        description: values.description ?? '',
        title: values.title,
        url: values.url ?? ''
      };

      if (editingNote) {
        updateNoteMutation.mutate({ data: payload, id: editingNote.id });
      } else {
        createNoteMutation.mutate({ data: payload });
      }
    },
    [createNoteMutation, updateNoteMutation, editingNote]
  );

  return {
    closeModal,
    createForm,
    editingNote,
    handleAddNote,
    handleEdit,
    handleFilterChange,
    handleSubmit,
    isModalOpen,
    isSubmitting: createNoteMutation.isPending || updateNoteMutation.isPending,
    searchParams
  };
};
