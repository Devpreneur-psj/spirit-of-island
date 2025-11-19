#!/bin/bash

# Aether Island 프로젝트 실행 스크립트

# set -e를 사용하지 않음 (일부 명령은 실패해도 계속 진행해야 함)
set -o pipefail  # 파이프라인에서 에러 감지

echo "🚀 Aether Island 프로젝트 시작..."

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

check_file() {
    if [ ! -f "$1" ]; then
        echo -e "${YELLOW}⚠️  $1 파일이 없습니다. 생성 중...${NC}"
        return 1
    fi
    return 0
}

# 실행 방법 선택
echo "실행 방법을 선택하세요:"
echo "1) Docker Compose (권장)"
echo "2) 로컬에서 직접 실행"
read -p "선택 (1 또는 2): " choice

case $choice in
    1)
        echo -e "${GREEN}🐳 Docker Compose로 실행합니다...${NC}"
        
        # Docker 확인
        check_command docker
        check_command docker-compose
        
        # 환경 변수 파일 확인
        if ! check_file "backend/.env"; then
            if [ -f "backend/env.example" ]; then
                cp backend/env.example backend/.env
                echo -e "${GREEN}✅ backend/.env 파일 생성됨${NC}"
            fi
        fi
        
        if ! check_file "frontend/.env"; then
            if [ -f "frontend/env.example" ]; then
                cp frontend/env.example frontend/.env
                echo -e "${GREEN}✅ frontend/.env 파일 생성됨${NC}"
            fi
        fi
        
        # Docker Compose 실행
        echo -e "${GREEN}📦 Docker Compose로 서비스 시작...${NC}"
        docker-compose up -d
        
        echo -e "${GREEN}⏳ 서비스가 시작되는 동안 잠시 기다려주세요...${NC}"
        sleep 10
        
        # 마이그레이션 실행
        echo -e "${GREEN}🔄 데이터베이스 마이그레이션 실행...${NC}"
        docker-compose exec -T backend alembic upgrade head || echo -e "${YELLOW}⚠️  마이그레이션이 이미 실행되었거나 오류가 발생했습니다.${NC}"
        
        echo -e "${GREEN}✅ 서비스가 시작되었습니다!${NC}"
        echo -e "${GREEN}프론트엔드: http://localhost:3000${NC}"
        echo -e "${GREEN}백엔드 API: http://localhost:8000${NC}"
        echo -e "${GREEN}API 문서: http://localhost:8000/docs${NC}"
        echo ""
        echo "로그 확인: docker-compose logs -f"
        echo "서비스 중지: docker-compose down"
        ;;
    
    2)
        echo -e "${GREEN}💻 로컬에서 직접 실행합니다...${NC}"
        
        # 필수 명령어 확인
        check_command python3
        check_command node
        check_command npm
        check_command psql
        
        # 환경 변수 파일 확인
        if ! check_file "backend/.env"; then
            if [ -f "backend/env.example" ]; then
                cp backend/env.example backend/.env
                echo -e "${GREEN}✅ backend/.env 파일 생성됨${NC}"
            fi
        fi
        
        if ! check_file "frontend/.env"; then
            if [ -f "frontend/env.example" ]; then
                cp frontend/env.example frontend/.env
                echo -e "${GREEN}✅ frontend/.env 파일 생성됨${NC}"
            fi
        fi
        
        # 백엔드 설정
        echo -e "${GREEN}🔧 백엔드 설정...${NC}"
        cd backend
        
        # Python 버전 확인
        PYTHON_CMD=$(which python3)
        PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | awk '{print $2}')
        echo -e "${GREEN}📌 사용 중인 Python: $PYTHON_CMD (버전: $PYTHON_VERSION)${NC}"
        
        # 가상 환경 재생성 (Python 버전 불일치 방지)
        if [ ! -d "venv" ]; then
            echo -e "${YELLOW}⚠️  가상 환경이 없습니다. 생성 중...${NC}"
            $PYTHON_CMD -m venv venv
        else
            # venv의 Python 버전 확인
            VENV_PYTHON_VERSION=$(venv/bin/python --version 2>&1 | awk '{print $2}')
            if [ "$PYTHON_VERSION" != "$VENV_PYTHON_VERSION" ]; then
                echo -e "${YELLOW}⚠️  가상 환경의 Python 버전이 다릅니다. 재생성 중...${NC}"
                echo -e "${YELLOW}   시스템: $PYTHON_VERSION, venv: $VENV_PYTHON_VERSION${NC}"
                rm -rf venv
                $PYTHON_CMD -m venv venv
            fi
        fi
        
        # 가상 환경 활성화
        source venv/bin/activate
        
        # pip 업그레이드
        echo -e "${GREEN}📦 pip 업그레이드 중...${NC}"
        pip install --upgrade pip setuptools wheel > /dev/null 2>&1
        
        # 의존성 설치
        echo -e "${GREEN}📦 의존성 설치 중...${NC}"
        pip install -r requirements.txt
        
        # 데이터베이스 마이그레이션
        echo -e "${GREEN}🔄 데이터베이스 마이그레이션 실행...${NC}"
        venv/bin/alembic upgrade head || echo -e "${YELLOW}⚠️  마이그레이션이 이미 실행되었거나 오류가 발생했습니다.${NC}"
        
        # 기존 백엔드 프로세스 종료 (포트 8000 사용 중인 경우)
        echo -e "${YELLOW}🔍 기존 백엔드 프로세스 확인 중...${NC}"
        if lsof -ti:8000 > /dev/null 2>&1; then
            echo -e "${YELLOW}⚠️  포트 8000이 사용 중입니다. 기존 프로세스를 종료합니다...${NC}"
            lsof -ti:8000 | xargs kill -9 2>/dev/null || true
            sleep 2
        fi
        
        # 백엔드 실행 (백그라운드) - venv의 uvicorn 사용
        echo -e "${GREEN}🚀 백엔드 시작...${NC}"
        echo -e "${GREEN}📌 uvicorn 경로: $(which uvicorn)${NC}"
        nohup venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > ../backend.pid
        echo -e "${GREEN}✅ 백엔드 프로세스 시작됨 (PID: $BACKEND_PID)${NC}"
        
        # 서버 시작 대기 (최대 10초)
        echo -e "${YELLOW}⏳ 백엔드 서버 시작 대기 중...${NC}"
        for i in {1..10}; do
            if curl -s http://localhost:8000/health > /dev/null 2>&1; then
                echo -e "${GREEN}✅ 백엔드 서버가 정상적으로 시작되었습니다!${NC}"
                break
            fi
            if [ $i -eq 10 ]; then
                echo -e "${YELLOW}⚠️  백엔드 서버 시작 확인 실패. 로그를 확인하세요: tail -f backend.log${NC}"
            else
                sleep 1
            fi
        done
        
        cd ..
        
        # 프론트엔드 설정
        echo -e "${GREEN}🔧 프론트엔드 설정...${NC}"
        cd frontend
        
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}⚠️  node_modules가 없습니다. 설치 중...${NC}"
            npm install
        fi
        
        # 프론트엔드 실행 (백그라운드)
        echo -e "${GREEN}🚀 프론트엔드 시작...${NC}"
        npm run dev > ../frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > ../frontend.pid
        
        cd ..
        
        echo -e "${GREEN}✅ 서비스가 시작되었습니다!${NC}"
        echo -e "${GREEN}프론트엔드: http://localhost:3000${NC}"
        echo -e "${GREEN}백엔드 API: http://localhost:8000${NC}"
        echo -e "${GREEN}API 문서: http://localhost:8000/docs${NC}"
        echo ""
        echo "백엔드 로그: tail -f backend.log"
        echo "프론트엔드 로그: tail -f frontend.log"
        echo "서비스 중지: ./stop.sh"
        ;;
    
    *)
        echo -e "${RED}❌ 잘못된 선택입니다.${NC}"
        exit 1
        ;;
esac

