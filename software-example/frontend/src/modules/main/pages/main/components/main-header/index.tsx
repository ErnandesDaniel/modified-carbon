import { Button, Flex, Typography } from 'antd';
import { signOut } from 'next-auth/react';
import type { DispatchWithoutAction } from 'react';
import { useCallback } from 'react';

const { Title } = Typography;

interface MainHeaderProps {
  onAddNote: DispatchWithoutAction;
}

export const MainHeader = ({ onAddNote }: MainHeaderProps) => {
  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch {
      // Ignore errors
    }
  }, []);

  return (
    <Flex align="center" gap={10}>
      <Title className="main-page__title" level={2}>
        Мои заметки
      </Title>
      <Button type="primary" onClick={onAddNote}>
        Создать заметку
      </Button>
      <Button onClick={handleLogout}>Выйти</Button>
    </Flex>
  );
};
