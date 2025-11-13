"""
마정령 자율 행동 AI 서비스
"""
import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.spiritling import Spiritling
from app.utils.spiritling_utils import check_level_up
from app.utils.action_log_utils import create_action_log


def update_spiritling_status(spiritling: Spiritling, db: Session):
    """마정령 상태 자동 업데이트 (배고픔, 행복도, 에너지 감소)"""
    # 시간 경과에 따른 상태 감소 (간단한 구현)
    # 실제로는 마지막 업데이트 시간을 확인하여 계산해야 함
    
    # 배고픔 감소 (1-3씩)
    if spiritling.hunger > 0:
        spiritling.hunger = max(0, spiritling.hunger - random.randint(1, 3))
    
    # 행복도 감소 (배고픔이 낮으면 더 많이 감소)
    if spiritling.hunger < 30:
        happiness_decrease = random.randint(2, 4)
    else:
        happiness_decrease = random.randint(0, 2)
    spiritling.happiness = max(0, spiritling.happiness - happiness_decrease)
    
    # 에너지 회복 (시간 경과에 따라)
    if spiritling.energy < 100:
        spiritling.energy = min(100, spiritling.energy + random.randint(1, 2))
    
    # 건강 상태 (청결도가 낮으면 건강도 감소)
    if spiritling.cleanliness < 30:
        spiritling.health_status = max(0, spiritling.health_status - random.randint(0, 1))
    
    # 청결도 감소
    if spiritling.cleanliness > 0:
        spiritling.cleanliness = max(0, spiritling.cleanliness - random.randint(0, 1))


def autonomous_action(spiritling: Spiritling, db: Session):
    """마정령 자율 행동"""
    action_messages = []
    
    # 배고픔이 낮으면 자동으로 먹기 시도
    if spiritling.hunger < 30 and random.random() < 0.3:
        spiritling.hunger = min(100, spiritling.hunger + random.randint(10, 20))
        spiritling.experience += 1
        message = f"{spiritling.name}가 스스로 먹이를 찾아 먹었습니다."
        create_action_log(db, spiritling.id, "auto_eat", message)
        action_messages.append(message)
    
    # 행복도가 낮으면 자동으로 놀기
    if spiritling.happiness < 40 and random.random() < 0.2:
        spiritling.happiness = min(100, spiritling.happiness + random.randint(5, 10))
        spiritling.energy = max(0, spiritling.energy - random.randint(5, 10))
        spiritling.experience += 1
        message = f"{spiritling.name}가 혼자서 놀고 있습니다."
        create_action_log(db, spiritling.id, "auto_play", message)
        action_messages.append(message)
    
    # 에너지가 많으면 자동으로 활동
    if spiritling.energy > 70 and random.random() < 0.1:
        spiritling.energy = max(0, spiritling.energy - random.randint(10, 15))
        spiritling.experience += random.randint(1, 2)
        activities = [
            "달리기를 했습니다.",
            "점프를 했습니다.",
            "공을 굴렸습니다.",
            "구름을 바라보고 있습니다."
        ]
        activity = random.choice(activities)
        message = f"{spiritling.name}가 {activity}"
        create_action_log(db, spiritling.id, "auto_activity", message)
        action_messages.append(message)
    
    # 레벨 업 체크
    leveled_up = check_level_up(spiritling)
    if leveled_up:
        message = f"{spiritling.name}가 레벨 {spiritling.level}로 성장했습니다!"
        create_action_log(db, spiritling.id, "level_up", message)
        action_messages.append(message)
    
    return action_messages


def process_spiritling(spiritling_id: str, db: Session):
    """마정령 상태 처리 (백그라운드 작업용)"""
    spiritling = db.query(Spiritling).filter(Spiritling.id == spiritling_id).first()
    if not spiritling:
        return
    
    try:
        # 상태 업데이트 (일정 확률로만 실행하여 부하 감소)
        if random.random() < 0.5:  # 50% 확률
            update_spiritling_status(spiritling, db)
        
        # 자율 행동 (일정 확률로만 실행)
        if random.random() < 0.3:  # 30% 확률
            autonomous_action(spiritling, db)
        else:
            # 자율 행동은 하지 않지만 상태만 업데이트
            pass
        
        db.commit()
        db.refresh(spiritling)
    except Exception as e:
        db.rollback()
        import traceback
        print(f"Error processing spiritling {spiritling_id}: {e}")
        traceback.print_exc()


async def background_spiritling_processor():
    """백그라운드에서 마정령 상태 처리 (주기적 실행)"""
    import time
    
    while True:
        try:
            db = SessionLocal()
            try:
                # 모든 마정령 처리
                spiritlings = db.query(Spiritling).all()
                for spiritling in spiritlings:
                    process_spiritling(spiritling.id, db)
                    # 각 마정령 처리 간 약간의 지연
                    await asyncio.sleep(0.1)
            finally:
                db.close()
            
            # 5분마다 실행 (테스트를 위해 1분으로 설정 가능)
            await asyncio.sleep(300)  # 5분
        except Exception as e:
            print(f"Error in background processor: {e}")
            import traceback
            traceback.print_exc()
            await asyncio.sleep(60)  # 에러 발생 시 1분 후 재시도


def start_background_processor():
    """백그라운드 프로세서 시작"""
    import threading
    import logging
    
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    def run_processor():
        try:
            asyncio.run(background_spiritling_processor())
        except Exception as e:
            logger.error(f"Background processor error: {e}")
    
    thread = threading.Thread(target=run_processor, daemon=True)
    thread.start()
    logger.info("마정령 자율 행동 AI 백그라운드 프로세서가 시작되었습니다.")
    return thread
