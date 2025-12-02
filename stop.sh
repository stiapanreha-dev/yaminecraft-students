#!/bin/bash

# Скрипт для остановки dev серверов

echo "=== Остановка серверов ==="

# Убить процессы на портах frontend
for port in 5173 5174 5175; do
    if fuser $port/tcp >/dev/null 2>&1; then
        echo "Останавливаю frontend на порту $port..."
        fuser -k $port/tcp 2>/dev/null
    fi
done

# Убить процессы на порту backend
if fuser 3000/tcp >/dev/null 2>&1; then
    echo "Останавливаю backend на порту 3000..."
    fuser -k 3000/tcp 2>/dev/null
fi

echo "Готово!"
