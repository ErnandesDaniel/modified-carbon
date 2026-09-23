package ru.scms.back.utils;

import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

public final class TransactionHelper {

    private TransactionHelper() {}

    /**
     * Выполняет действие после успешного коммита текущей транзакции.
     * Если транзакция не активна — выполняет сразу.
     * Используется для публикации MQTT-событий, чтобы клиенты не получали
     * уведомления об изменениях, которые в итоге откатились.
     */
    public static void afterCommit(Runnable action) {
        if (TransactionSynchronizationManager.isSynchronizationActive()
                && TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    action.run();
                }
            });
        } else {
            action.run();
        }
    }
}
