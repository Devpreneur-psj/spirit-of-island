"""
초기 아이템 데이터 생성 스크립트
"""
from app.core.database import SessionLocal, engine, Base
from app.models import *
import json


def init_items():
    """초기 아이템 데이터 생성"""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # 기존 아이템 확인
        existing_items = db.query(Item).count()
        if existing_items > 0:
            print(f"이미 {existing_items}개의 아이템이 존재합니다.")
            return
        
        # 아이템 데이터
        items_data = [
            {
                "id": "item_food_001",
                "name": "기본 사료",
                "type": "food",
                "description": "마정령의 배고픔을 채워주는 기본 사료",
                "effect": {"status": "hunger", "value": 20},
                "price": 10,
                "rarity": "common"
            },
            {
                "id": "item_food_002",
                "name": "고급 사료",
                "type": "food",
                "description": "마정령의 배고픔을 크게 채워주는 고급 사료",
                "effect": {"status": "hunger", "value": 40},
                "price": 50,
                "rarity": "rare"
            },
            {
                "id": "item_vitamin_001",
                "name": "비타민",
                "type": "vitamin",
                "description": "마정령의 건강을 회복시켜주는 비타민",
                "effect": {"status": "health", "value": 30},
                "price": 30,
                "rarity": "common"
            },
            {
                "id": "item_medicine_001",
                "name": "치료 키트",
                "type": "medicine",
                "description": "마정령의 건강을 크게 회복시켜주는 치료 키트",
                "effect": {"status": "health", "value": 50},
                "price": 100,
                "rarity": "rare"
            },
            {
                "id": "item_toy_001",
                "name": "장난감",
                "type": "toy",
                "description": "마정령의 행복도를 높여주는 장난감",
                "effect": {"status": "happiness", "value": 25},
                "price": 40,
                "rarity": "common"
            },
            {
                "id": "item_train_001",
                "name": "훈련 도구",
                "type": "accessory",
                "description": "마정령의 체력을 증가시켜주는 훈련 도구",
                "effect": {"stat": "health", "value": 5},
                "price": 80,
                "rarity": "rare"
            },
            {
                "id": "item_train_002",
                "name": "민첩 훈련 도구",
                "type": "accessory",
                "description": "마정령의 민첩을 증가시켜주는 훈련 도구",
                "effect": {"stat": "agility", "value": 5},
                "price": 80,
                "rarity": "rare"
            },
            {
                "id": "item_train_003",
                "name": "지능 훈련 도구",
                "type": "accessory",
                "description": "마정령의 지능을 증가시켜주는 훈련 도구",
                "effect": {"stat": "intelligence", "value": 5},
                "price": 80,
                "rarity": "rare"
            },
        ]
        
        # 아이템 생성
        for item_data in items_data:
            item = Item(**item_data)
            db.add(item)
        
        db.commit()
        print(f"{len(items_data)}개의 아이템이 생성되었습니다.")
        
    except Exception as e:
        print(f"오류 발생: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_items()

