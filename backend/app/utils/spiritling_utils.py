"""
마정령 유틸리티 함수
"""
from app.models.spiritling import Spiritling


def check_level_up(spiritling: Spiritling) -> bool:
    """레벨 업 체크 및 성장 단계 업데이트"""
    required_exp = spiritling.level * 100
    if spiritling.experience >= required_exp:
        spiritling.level += 1
        spiritling.experience = 0
        # 레벨업 시 모든 스탯 증가
        spiritling.health_stat = min(100, spiritling.health_stat + 1)
        spiritling.agility_stat = min(100, spiritling.agility_stat + 1)
        spiritling.intelligence_stat = min(100, spiritling.intelligence_stat + 1)
        spiritling.friendliness_stat = min(100, spiritling.friendliness_stat + 1)
        spiritling.resilience_stat = min(100, spiritling.resilience_stat + 1)
        spiritling.luck_stat = min(100, spiritling.luck_stat + 1)
        
        # 성장 단계 업데이트
        if spiritling.level >= 50:
            spiritling.growth_stage = "elder"
        elif spiritling.level >= 40:
            spiritling.growth_stage = "transcendent"
        elif spiritling.level >= 25:
            spiritling.growth_stage = "adult"
        elif spiritling.level >= 15:
            spiritling.growth_stage = "adolescent"
        elif spiritling.level >= 5:
            spiritling.growth_stage = "infant"
        
        return True
    return False

