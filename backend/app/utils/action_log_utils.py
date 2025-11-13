"""
행동 로그 유틸리티 함수
"""
import uuid
from sqlalchemy.orm import Session
from app.models.action_log import ActionLog


def create_action_log(
    db: Session,
    spiritling_id: str,
    action_type: str,
    message: str
) -> ActionLog:
    """행동 로그 생성"""
    action_log = ActionLog(
        id=str(uuid.uuid4()),
        spiritling_id=spiritling_id,
        action_type=action_type,
        message=message
    )
    db.add(action_log)
    db.commit()
    db.refresh(action_log)
    return action_log

