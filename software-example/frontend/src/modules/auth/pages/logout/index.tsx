'use client';

import { signOut } from 'next-auth/react';
import { useCallback } from 'react';

const LogoutPage = () => {
  const onLogoutClick = useCallback(async () => {
    try {
      await signOut();
    } catch {
      return;
    }
  }, []);

  return (
    <div>
      Страница выхода
      <button onClick={onLogoutClick}>Выйти</button>
    </div>
  );
};

export default LogoutPage;
