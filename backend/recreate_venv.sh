#!/bin/bash
# 가상 환경 재생성 스크립트

set -e

echo "🔄 백엔드 가상 환경 재생성 중..."

# 현재 디렉토리 확인
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt를 찾을 수 없습니다. backend 디렉토리에서 실행하세요."
    exit 1
fi

# Python 버전 확인
PYTHON_CMD=$(which python3)
PYTHON_VERSION=$($PYTHON_CMD --version 2>&1)
echo "📌 사용 중인 Python: $PYTHON_CMD"
echo "📌 Python 버전: $PYTHON_VERSION"

# 기존 venv 백업 (선택적)
if [ -d "venv" ]; then
    echo "⚠️  기존 venv 발견. 백업 중..."
    mv venv venv.backup.$(date +%Y%m%d_%H%M%S) || true
fi

# 새 venv 생성
echo "📦 새 가상 환경 생성 중..."
$PYTHON_CMD -m venv venv

# 가상 환경 활성화
source venv/bin/activate

# pip 업그레이드
echo "📦 pip 업그레이드 중..."
pip install --upgrade pip setuptools wheel

# 의존성 설치
echo "📦 의존성 설치 중..."
pip install -r requirements.txt

# 설치 확인
echo ""
echo "✅ 가상 환경 재생성 완료!"
echo "📌 Python 버전: $(venv/bin/python --version)"
echo "📌 pip 버전: $(venv/bin/pip --version)"
echo ""
echo "가상 환경 활성화: source venv/bin/activate"

