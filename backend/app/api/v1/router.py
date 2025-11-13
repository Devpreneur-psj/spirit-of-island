from fastapi import APIRouter
from app.api.v1 import auth, users, spiritlings, items, competitions, user_items, action_logs, competition_rewards, friends, village, rankings, achievements, events

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["인증"])
api_router.include_router(users.router, prefix="/users", tags=["사용자"])
api_router.include_router(spiritlings.router, prefix="/spiritlings", tags=["마정령"])
api_router.include_router(items.router, prefix="/items", tags=["아이템"])
api_router.include_router(user_items.router, prefix="/user-items", tags=["사용자 아이템"])
api_router.include_router(competitions.router, prefix="/competitions", tags=["대회"])
api_router.include_router(competition_rewards.router, prefix="/competitions", tags=["대회 보상"])
api_router.include_router(action_logs.router, prefix="/action-logs", tags=["행동 로그"])
api_router.include_router(friends.router, prefix="/friends", tags=["친구"])
api_router.include_router(village.router, prefix="/village", tags=["마을"])
api_router.include_router(rankings.router, prefix="/rankings", tags=["랭킹"])
api_router.include_router(achievements.router, prefix="/achievements", tags=["업적"])
api_router.include_router(events.router, prefix="/events", tags=["이벤트"])

