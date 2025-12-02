#!/bin/bash

# Скрипт для запуска dev серверов frontend и backend
# Убивает существующие процессы перед запуском

FRONTEND_PORT=5173
BACKEND_PORT=3000

echo "=== Остановка существующих процессов ==="

# Убить процессы на портах frontend (5173-5175)
for port in 5173 5174 5175; do
    if fuser $port/tcp >/dev/null 2>&1; then
        echo "Останавливаю процесс на порту $port..."
        fuser -k $port/tcp 2>/dev/null
    fi
done

# Убить процессы на порту backend (3000)
if fuser $BACKEND_PORT/tcp >/dev/null 2>&1; then
    echo "Останавливаю процесс на порту $BACKEND_PORT..."
    fuser -k $BACKEND_PORT/tcp 2>/dev/null
fi

# Подождать немного
sleep 1

echo ""
echo "=== Запуск серверов ==="

# Определяем корневую директорию проекта
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Запуск backend
echo "Запускаю backend на порту $BACKEND_PORT..."
cd "$SCRIPT_DIR/backend"
npm run start:dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Запуск frontend
echo "Запускаю frontend на порту $FRONTEND_PORT..."
cd "$SCRIPT_DIR/frontend"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Подождать запуска
sleep 3

echo ""
echo "=== Серверы запущены ==="
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo ""
echo "PID Frontend: $FRONTEND_PID"
echo "PID Backend:  $BACKEND_PID"
echo ""
echo "Логи:"
echo "  Frontend: /tmp/frontend.log"
echo "  Backend:  /tmp/backend.log"
echo ""
echo "Для остановки: ./stop.sh или fuser -k $FRONTEND_PORT/tcp $BACKEND_PORT/tcp"
