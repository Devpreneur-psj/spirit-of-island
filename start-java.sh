#!/bin/bash

# Aether Island Java Backend 실행 스크립트

set -o pipefail

echo "🚀 Aether Island Java Backend 시작..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 함수 정의
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1이 설치되어 있지 않습니다.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ $1 확인됨${NC}"
}

# 필수 명령어 확인
check_command java
check_command mvn

# Java 버전 확인
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | awk -F '"' '{print $2}')
echo -e "${GREEN}📌 Java 버전: $JAVA_VERSION${NC}"

# 백엔드 디렉토리로 이동
cd backend-java || {
    echo -e "${RED}❌ backend-java 디렉토리를 찾을 수 없습니다.${NC}"
    exit 1
}

# 기존 백엔드 프로세스 종료 (포트 8000 사용 중인 경우)
echo -e "${YELLOW}🔍 기존 백엔드 프로세스 확인 중...${NC}"
if lsof -ti:8000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  포트 8000이 사용 중입니다. 기존 프로세스를 종료합니다...${NC}"
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Maven 빌드
echo -e "${GREEN}📦 Maven 빌드 중...${NC}"
mvn clean package -DskipTests || {
    echo -e "${RED}❌ Maven 빌드 실패${NC}"
    exit 1
}

# 백엔드 실행 (백그라운드)
echo -e "${GREEN}🚀 백엔드 시작...${NC}"
nohup java -jar target/aether-island-backend-1.0.0.jar > ../backend-java.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend-java.pid
echo -e "${GREEN}✅ 백엔드 프로세스 시작됨 (PID: $BACKEND_PID)${NC}"

# 서버 시작 대기 (최대 15초)
echo -e "${YELLOW}⏳ 백엔드 서버 시작 대기 중...${NC}"
for i in {1..15}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 백엔드 서버가 정상적으로 시작되었습니다!${NC}"
        echo -e "${GREEN}프론트엔드: http://localhost:3000${NC}"
        echo -e "${GREEN}백엔드 API: http://localhost:8000${NC}"
        echo -e "${GREEN}Health check: http://localhost:8000/health${NC}"
        break
    fi
    if [ $i -eq 15 ]; then
        echo -e "${YELLOW}⚠️  백엔드 서버 시작 확인 실패. 로그를 확인하세요: tail -f backend-java.log${NC}"
    else
        sleep 1
    fi
done

cd ..

echo ""
echo "백엔드 로그: tail -f backend-java.log"
echo "서비스 중지: ./stop-java.sh"

