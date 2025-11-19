#!/bin/bash

# Aether Island 프로젝트 중지 스크립트

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🛑 Aether Island 프로젝트 중지..."

# 실행 방법 확인
if [ -f "docker-compose.yml" ] && docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}🐳 Docker Compose로 실행 중인 서비스를 중지합니다...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ 서비스가 중지되었습니다.${NC}"
elif [ -f "backend.pid" ] || [ -f "frontend.pid" ] || lsof -ti:8000 > /dev/null 2>&1 || lsof -ti:3000 > /dev/null 2>&1 || lsof -ti:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}💻 로컬에서 실행 중인 서비스를 중지합니다...${NC}"
    
    # 포트 8000 사용 중인 프로세스 종료
    if lsof -ti:8000 > /dev/null 2>&1; then
        echo -e "${YELLOW}🔍 포트 8000 사용 중인 프로세스 종료 중...${NC}"
        lsof -ti:8000 | xargs kill -9 2>/dev/null || true
        echo -e "${GREEN}✅ 포트 8000 프로세스 종료됨${NC}"
    fi
    
    # 포트 3000, 5173 사용 중인 프로세스 종료
    if lsof -ti:3000 > /dev/null 2>&1 || lsof -ti:5173 > /dev/null 2>&1; then
        echo -e "${YELLOW}🔍 프론트엔드 포트 사용 중인 프로세스 종료 중...${NC}"
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        lsof -ti:5173 | xargs kill -9 2>/dev/null || true
        echo -e "${GREEN}✅ 프론트엔드 프로세스 종료됨${NC}"
    fi
    
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            kill $BACKEND_PID 2>/dev/null || true
            echo -e "${GREEN}✅ 백엔드가 중지되었습니다.${NC}"
        fi
        rm -f backend.pid
    fi
    
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            kill $FRONTEND_PID 2>/dev/null || true
            echo -e "${GREEN}✅ 프론트엔드가 중지되었습니다.${NC}"
        fi
        rm -f frontend.pid
    fi
    
    # 로그 파일 정리 (선택사항)
    read -p "로그 파일을 삭제하시겠습니까? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f backend.log frontend.log
        echo -e "${GREEN}✅ 로그 파일이 삭제되었습니다.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  실행 중인 서비스를 찾을 수 없습니다.${NC}"
fi

