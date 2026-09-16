'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Empty, Flex, message, Pagination, Spin } from 'antd';
import { useCallback, useContext, useState } from 'react';

import { getGetNotesListQueryKey, useDeleteNote, useGetNotesList } from '@/api/rest-client';
import type { NoteResponseDto } from '@/api/rest-client/dto';
import ConditionalRender from '@/components/conditional-render';
import { NotificationContext } from '@/components/providers/notification-provider';
import { NotesList } from '@/modules/main/pages/main/components/notes-list';
import { NOTE_SUCCESSFULLY_DELETED } from '@/modules/main/pages/main/components/notes-section/templates';

const PAGE_SIZE = 9;

interface NotesSectionProps {
  searchQuery: string | undefined;
  useSemanticSearch: boolean;
  semanticLimit: number | undefined;
  denseWeight: number;
  sparseWeight: number;
  textWeight: number;
  onEdit: (note: NoteResponseDto) => void;
}

export const NotesSection = ({
  denseWeight,
  onEdit,
  searchQuery,
  semanticLimit,
  sparseWeight,
  textWeight,
  useSemanticSearch
}: NotesSectionProps) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);

  const providedNotificationApi = useContext(NotificationContext);

  // Запрос на получение заметок
  const { data: notesData, isLoading } = useGetNotesList({
    denseWeight,
    page: currentPage,
    searchQuery,
    semantic: useSemanticSearch,
    semanticLimit: semanticLimit ?? 5,
    size: PAGE_SIZE,
    sparseWeight,
    textWeight
  });

  // Мутация удаления
  const deleteNoteMutation = useDeleteNote({
    mutation: {
      onError: (error: Error) => {
        message.error('Ошибка при удалении заметки');
        console.error(error);
      },
      onSuccess: () => {
        providedNotificationApi?.success(NOTE_SUCCESSFULLY_DELETED);
        void queryClient.invalidateQueries({ queryKey: getGetNotesListQueryKey() });
      }
    }
  });

  const handleDelete = useCallback(
    (id: number) => {
      deleteNoteMutation.mutate({ id });
    },
    [deleteNoteMutation]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page - 1);
  }, []);

  const notes = notesData?.content ?? [];
  const totalElements = notesData?.totalElements ?? 0;

  return (
    <>
      <Spin spinning={isLoading} tip="Загрузка...">
        <div className="main-page__notes-container">
          {notes.length === 0 ? (
            <Empty description="У вас пока нет заметок" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <NotesList
              isDeleting={deleteNoteMutation.isPending}
              notes={notes}
              onDelete={handleDelete}
              onEdit={onEdit}
            />
          )}
        </div>
      </Spin>
      <ConditionalRender condition={notes.length > 0}>
        <Flex justify="center">
          <Pagination
            current={currentPage + 1}
            disabled={isLoading}
            pageSize={PAGE_SIZE}
            total={totalElements}
            onChange={handlePageChange}
          />
        </Flex>
      </ConditionalRender>
    </>
  );
};
