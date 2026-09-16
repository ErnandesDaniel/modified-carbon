#!/bin/bash

# Получаем имя модели из переменной окружения (по умолчанию mxbai-embed-large)
MODEL_NAME="${OLLAMA_EMBEDDING_MODEL:-mxbai-embed-large}"

echo "========================================"
echo "Starting Ollama Server..."
echo "========================================"
echo "Configured embedding model: $MODEL_NAME"

# Запускаем ollama serve в фоне
ollama serve &
OLLAMA_PID=$!

# Даём серверу время запуститься
echo "Waiting for Ollama server to start..."
sleep 10

echo ""
echo "========================================"
echo "Downloading embedding model: $MODEL_NAME"
echo "========================================"

# Скачиваем модель (ollama pull пропускает если уже есть)
ollama pull $MODEL_NAME

# Определяем размер модели для вывода
MODEL_INFO=$(ollama list | grep "$MODEL_NAME" | awk '{print $2}')
if [ -n "$MODEL_INFO" ]; then
    echo ""
    echo "========================================"
    echo "Ollama initialization complete!"
    echo "- Model: $MODEL_NAME"
    echo "- Size: $MODEL_INFO"
    echo "========================================"
    echo "✓ Model verified!"
else
    echo ""
    echo "✗ WARNING: Model $MODEL_NAME not found in list"
fi

# Ждем завершения основного процесса
wait $OLLAMA_PID