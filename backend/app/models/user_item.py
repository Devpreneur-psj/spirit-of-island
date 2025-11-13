from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class UserItem(Base):
    __tablename__ = "user_items"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    item_id = Column(String, ForeignKey("items.id"), nullable=False)
    quantity = Column(Integer, default=1)

    # 관계
    user = relationship("User", back_populates="items")
    item = relationship("Item")

