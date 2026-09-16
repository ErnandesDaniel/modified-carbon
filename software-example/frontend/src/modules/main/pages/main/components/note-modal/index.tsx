'use client';

import { Button, Flex, Form, Modal } from 'antd';
import { memo, useCallback, useEffect } from 'react';

import type { NoteResponseDto } from '@/api/rest-client/dto';
import FormInput from '@/components/form/form-input';
import FormTextarea from '@/components/form/form-textarea';
import type { NoteFormValues } from '@/modules/main/pages/main/types';

interface NoteModalProps {
  isOpen: boolean;
  editingNote: NoteResponseDto | undefined;
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => void;
  isLoading: boolean;
  form: ReturnType<typeof Form.useForm<NoteFormValues>>[0];
}

const NoteModal = ({ editingNote, form, isLoading, isOpen, onClose, onSubmit }: NoteModalProps) => {
  useEffect(() => {
    if (isOpen) {
      if (editingNote) {
        form.setFieldsValue({
          description: editingNote.description,
          title: editingNote.title,
          url: editingNote.url
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, editingNote, form]);

  const handleSubmit = useCallback(
    (values: NoteFormValues) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  const title = editingNote ? 'Редактирование заметки' : 'Создание новой заметки';
  const submitText = editingNote ? 'Сохранить' : 'Создать';

  return (
    <Modal destroyOnHidden footer={null} open={isOpen} title={title} onCancel={onClose}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Flex vertical gap={10}>
          <FormInput
            isRequired
            errorText="Пожалуйста, введите название заметки"
            label="Название"
            maxLength={255}
            name="title"
          />
          <FormTextarea autoSize label="Описание" minRows={3} name="description" />
          <FormInput label="URL" name="url" />
          <Flex className="main-page__modal-actions">
            <Button onClick={onClose}>Отмена</Button>
            <Button htmlType="submit" loading={isLoading} type="primary">
              {submitText}
            </Button>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
};

export default memo(NoteModal);
