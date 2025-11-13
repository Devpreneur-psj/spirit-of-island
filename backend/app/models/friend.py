from sqlalchemy import Column, String, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class Friend(Base):
    __tablename__ = "friends"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    friend_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending")  # pending, accepted, blocked
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # 관계
    user = relationship("User", foreign_keys=[user_id])
    friend = relationship("User", foreign_keys=[friend_id])

    # 고유 제약 조건: 같은 사용자 간의 중복 친구 관계 방지
    __table_args__ = (
        UniqueConstraint('user_id', 'friend_id', name='unique_friend_relationship'),
    )

