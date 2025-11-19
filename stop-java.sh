#!/bin/bash

# Aether Island Java Backend 중지 스크립트

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🛑 Aether Island Java Backend 중지..."

# 포트 8000 사용 중인 프로세스 종료
if lsof -ti:8000 > /dev/null 2>&1; then
    echo -e "${YELLOW}🔍 포트 8000 사용 중인 프로세스 종료 중...${NC}"
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✅ 포트 8000 프로세스 종료됨${NC}"
fi

if [ -f "backend-java.pid" ]; then
    BACKEND_PID=$(cat backend-java.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID 2>/dev/null || true
        echo -e "${GREEN}✅ 백엔드가 중지되었습니다.${NC}"
    fi
    rm -f backend-java.pid
fi

echo -e "${GREEN}✅ 서비스가 중지되었습니다.${NC}"

