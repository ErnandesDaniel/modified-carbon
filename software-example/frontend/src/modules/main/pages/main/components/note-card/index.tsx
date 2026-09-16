import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { Button, Card, Flex, Modal, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useCallback, useState } from 'react';

/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import type { NoteCardProps } from './type';

const { Text } = Typography;

const formatDate = (dateString: string): string => dayjs(dateString).format('DD.MM.YYYY HH:mm');

const ACTION_BUTTONS_STYLE = { fontSize: '11px' };
const MODAL_TEXT_STYLE = { color: '#8c8c8c', fontSize: '14px' };
const WARNING_ICON_STYLE = { color: '#ff4d4f', marginRight: 8 };

const getCardActions = (
  isDeleting: boolean,
  handleEdit: () => void,
  showDeleteModal: () => void
): React.ReactNode[] => [
  <Button key="edit" icon={<EditOutlined />} size="small" type="text" onClick={handleEdit}>
    Редактировать
  </Button>,
  <Button
    key="delete"
    danger
    icon={<DeleteOutlined />}
    loading={isDeleting}
    size="small"
    type="text"
    onClick={showDeleteModal}
  >
    Удалить
  </Button>
];

const NoteCard = ({ isDeleting, note, onDelete, onEdit }: NoteCardProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = useCallback(() => {
    onEdit(note);
  }, [note, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(note.id);
    setIsDeleteModalOpen(false);
  }, [note.id, onDelete]);

  const showDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const hideDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <Card
        hoverable
        actions={getCardActions(isDeleting ?? false, handleEdit, showDeleteModal)}
        className="main-page__note-card"
        size="small"
      >
        <Card.Meta
          title={<Text ellipsis={{ tooltip: note.title }}>{note.title}</Text>}
          description={
            <Flex vertical className="main-page__note-description" gap="4px">
              {note.description && (
                <Text className="main-page__note-text" type="secondary">
                  {note.description}
                </Text>
              )}
              {note.url && (
                <Tag color="blue" icon={<LinkOutlined />} style={ACTION_BUTTONS_STYLE}>
                  <a href={note.url} rel="noopener noreferrer" target="_blank" onClick={handleLinkClick}>
                    Ссылка
                  </a>
                </Tag>
              )}
              <Text className="main-page__note-date" style={ACTION_BUTTONS_STYLE} type="secondary">
                <CalendarOutlined /> {formatDate(note.createdAt)}
              </Text>
            </Flex>
          }
        />
      </Card>
      <Modal
        centered
        cancelText="Отмена"
        okButtonProps={{ danger: true, loading: isDeleting }}
        okText="Да, удалить"
        open={isDeleteModalOpen}
        title={
          <span>
            {}
            <ExclamationCircleOutlined style={WARNING_ICON_STYLE} />
            Удалить заметку?
          </span>
        }
        onCancel={hideDeleteModal}
        onOk={handleDelete}
      >
        <p>Вы уверены, что хотите удалить заметку &quot;{note.title}&quot;?</p>
        {}
        <p style={MODAL_TEXT_STYLE}>Это действие нельзя отменить.</p>
      </Modal>
    </>
  );
};

export default memo(NoteCard);
