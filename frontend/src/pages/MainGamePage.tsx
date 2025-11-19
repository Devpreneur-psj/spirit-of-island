import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useSpiritlingStore } from '../stores/spiritlingStore'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import WorldMapView from '../components/WorldMapView'
import LevelUpNotification from '../components/LevelUpNotification'
import { Location, locations } from '../config/locations'
import {
  SpiritlingProfile,
  ActionPanel,
  SpiritlingList,
  ItemShop,
  Inventory,
  ActionLog,
  CompetitionList,
  FriendList,
  VillageView,
  TabLoadingFallback,
} from '../components/LazyTabContent'
import RankingList from '../components/RankingList'
import AchievementList from '../components/AchievementList'
import EventList from '../components/EventList'
import FeatureModal from '../components/FeatureModal'
import VillageCanvas from '../components/VillageCanvas'
import TaskAssignmentPanel from '../components/TaskAssignmentPanel'
import { locations } from '../config/locations'

export default function MainGamePage() {
  const { user, logout, fetchCurrentUser } = useAuthStore()
  const { spiritlings, fetchSpiritlings, selectedSpiritling, previousLevel } = useSpiritlingStore()
  const [openModal, setOpenModal] = useState<{ type: string; location: Location | null }>({ type: '', location: null })

  const handleLocationClick = useCallback((location: Location) => {
    if (location.unlocked === false) {
      alert(`이 장소는 레벨 ${location.level || 0}에 잠금 해제됩니다.`)
      return
    }
    
    // 모든 장소를 모달로 열기
    setOpenModal({ type: location.id, location })
  }, [])
  
  const closeModal = useCallback(() => {
    setOpenModal({ type: '', location: null })
  }, [])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  // Memoize user coins to prevent unnecessary re-renders
  const userCoins = useMemo(() => user?.coins || 0, [user?.coins])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openModal.type) {
        closeModal()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openModal.type, closeModal])

  useEffect(() => {
    fetchCurrentUser()
    fetchSpiritlings()
  }, [fetchCurrentUser, fetchSpiritlings])

  return (
    <div className="min-h-screen p-2 sm:p-4">
      {/* 레벨 업 알림 */}
      <LevelUpNotification 
        spiritling={selectedSpiritling || null} 
        previousLevel={previousLevel}
      />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pastel-purple to-pastel-pink bg-clip-text text-transparent flex items-center gap-2"
            aria-label="Aether Island 게임"
          >
            <motion.span
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-3xl sm:text-4xl"
              aria-hidden="true"
            >
              🏝️
            </motion.span>
            <span>Aether Island</span>
          </motion.h1>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <motion.div 
              className="card py-2 px-3 sm:px-4 flex-1 sm:flex-initial flex items-center gap-1 sm:gap-2"
              whileHover={{ scale: 1.05 }}
              role="status"
              aria-label={`보유 코인: ${userCoins}`}
            >
              <span className="text-base sm:text-lg" aria-hidden="true">💰</span>
              <span className="text-xs sm:text-sm text-gray-600">코인:</span>
              <motion.span 
                className="ml-1 sm:ml-2 font-bold text-pastel-purple"
                key={userCoins}
                initial={{ scale: 1.2, color: '#22c55e' }}
                animate={{ scale: 1, color: '#a78bfa' }}
                transition={{ duration: 0.3 }}
                aria-live="polite"
                aria-atomic="true"
              >
                {userCoins}
              </motion.span>
            </motion.div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-6 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2"
              aria-label="로그아웃"
            >
              로그아웃
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - World Map View */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <WorldMapView 
              onLocationClick={handleLocationClick}
            />
          </motion.div>

          {/* 기능 모달들 */}
          {openModal.location && (
            <FeatureModal
              isOpen={openModal.type === 'element-home'}
              onClose={closeModal}
              title="원소 홈"
              description="마정령들이 놀고 있는 곳"
              icon="🏠"
              color="from-purple-500 to-pink-600"
            >
              <Suspense fallback={<TabLoadingFallback />}>
                {spiritlings.length === 0 ? (
                  <div className="card">
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">마정령이 없습니다.</p>
                      <p className="text-sm text-gray-400">마정령을 생성하면 원소 홈에 나타납니다.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <VillageCanvas
                      spiritlings={spiritlings}
                      onSpiritlingClick={setHomeSelectedSpiritling}
                      onNavigate={handleNavigateFromBuilding}
                      autoMove={true}
                      readonly={false}
                    />
                    {homeSelectedSpiritling && (
                      <div className="card">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">마정령 정보</h3>
                          <button
                            onClick={() => setHomeSelectedSpiritling(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>
                        <SpiritlingProfile spiritling={homeSelectedSpiritling} />
                        <div className="mt-4">
                          <TaskAssignmentPanel 
                            spiritling={homeSelectedSpiritling}
                            onTaskAssigned={() => {
                              // 작업 지정 후 정령 목록 새로고침
                              fetchSpiritlings()
                            }}
                          />
                        </div>
                        <div className="mt-4">
                          <ActionPanel spiritling={homeSelectedSpiritling} />
                        </div>
                        <div className="mt-4">
                          <ActionLog spiritlingId={homeSelectedSpiritling.id} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Suspense>
            </FeatureModal>
          )}

          {openModal.location && (
            <FeatureModal
              isOpen={openModal.type === 'item-shop'}
              onClose={closeModal}
              title="아이템 상점"
              description="다양한 아이템을 구매하세요"
              icon="🛒"
              color="from-orange-500 to-yellow-600"
            >
              <Suspense fallback={<TabLoadingFallback />}>
                <ItemShop />
              </Suspense>
            </FeatureModal>
          )}

          {openModal.location && (
            <FeatureModal
              isOpen={openModal.type === 'inventory'}
              onClose={closeModal}
              title="보관함"
              description="보유한 아이템을 확인하세요"
              icon="📦"
              color="from-blue-500 to-cyan-600"
            >
              <Suspense fallback={<TabLoadingFallback />}>
                <Inventory />
              </Suspense>
            </FeatureModal>
          )}

          {openModal.location && (
            <FeatureModal
              isOpen={openModal.type === 'competition-hall'}
              onClose={closeModal}
              title="대회장"
              description="마정령 대회에 참가하세요"
              icon="🏆"
              color="from-yellow-500 to-orange-600"
            >
              <Suspense fallback={<TabLoadingFallback />}>
                <CompetitionList />
              </Suspense>
            </FeatureModal>
          )}

          {openModal.location && (
            <FeatureModal
              isOpen={openModal.type === 'friend-village'}
              onClose={closeModal}
              title="친구 마을"
              description="친구들과 소통하세요"
              icon="👥"
              color="from-green-500 to-emerald-600"
            >
              <Suspense fallback={<TabLoadingFallback />}>
                <FriendList />
              </Suspense>
            </FeatureModal>
          )}

          {openModal.location && (
            <FeatureModal
              isOpen={openModal.type === 'village-square'}
              onClose={closeModal}
              title="마을 광장"
              description="다른 플레이어들을 만나보세요"
              icon="🏛️"
              color="from-indigo-500 to-purple-600"
            >
              <Suspense fallback={<TabLoadingFallback />}>
                <VillageView />
              </Suspense>
            </FeatureModal>
          )}

          {openModal.location && (
            <FeatureModal
              isOpen={openModal.type === 'ranking-hall'}
              onClose={closeModal}
              title="명예의 전당"
              description="최고의 마정령들을 확인하세요"
              icon="⭐"
              color="from-amber-500 to-yellow-600"
            >
              <Suspense fallback={<TabLoadingFallback />}>
                <RankingList />
              </Suspense>
            </FeatureModal>
          )}

          {openModal.location && (
            <FeatureModal
              isOpen={openModal.type === 'achievement-island'}
              onClose={closeModal}
              title="업적 섬"
              description="달성한 업적을 확인하세요"
              icon="🎖️"
              color="from-rose-500 to-pink-600"
            >
              <Suspense fallback={<TabLoadingFallback />}>
                <AchievementList />
              </Suspense>
            </FeatureModal>
          )}

          {openModal.location && (
            <FeatureModal
              isOpen={openModal.type === 'event-island'}
              onClose={closeModal}
              title="이벤트 섬"
              description="진행 중인 이벤트를 확인하세요"
              icon="🎉"
              color="from-violet-500 to-purple-600"
            >
              <Suspense fallback={<TabLoadingFallback />}>
                <EventList />
              </Suspense>
            </FeatureModal>
          )}

          {/* Right Column - Profile and Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 sm:space-y-6 order-1 lg:order-2"
          >
            {/* 탭 메뉴 */}
            <div 
              className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto scrollbar-hide -mx-2 sm:mx-0 px-2 sm:px-0"
              role="tablist"
              aria-label="메인 메뉴 탭"
            >
              <button
                onClick={() => {
                  const location = locations.find(loc => loc.id === 'element-home')
                  if (location) setOpenModal({ type: 'element-home', location })
                }}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                마정령
              </button>
              <button
                onClick={() => {
                  const location = locations.find(loc => loc.id === 'item-shop')
                  if (location) setOpenModal({ type: 'item-shop', location })
                }}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                상점
              </button>
              <button
                onClick={() => {
                  const location = locations.find(loc => loc.id === 'inventory')
                  if (location) setOpenModal({ type: 'inventory', location })
                }}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                인벤토리
              </button>
              <button
                onClick={() => {
                  const location = locations.find(loc => loc.id === 'competition-hall')
                  if (location) setOpenModal({ type: 'competition-hall', location })
                }}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                대회
              </button>
              <button
                onClick={() => {
                  const location = locations.find(loc => loc.id === 'friend-village')
                  if (location) setOpenModal({ type: 'friend-village', location })
                }}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                친구
              </button>
              <button
                onClick={() => {
                  const location = locations.find(loc => loc.id === 'village-square')
                  if (location) setOpenModal({ type: 'village-square', location })
                }}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                마을
              </button>
              <button
                onClick={() => {
                  const location = locations.find(loc => loc.id === 'ranking-hall')
                  if (location) setOpenModal({ type: 'ranking-hall', location })
                }}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                랭킹
              </button>
              <button
                onClick={() => {
                  const location = locations.find(loc => loc.id === 'achievement-island')
                  if (location) setOpenModal({ type: 'achievement-island', location })
                }}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                업적
              </button>
              <button
                onClick={() => {
                  const location = locations.find(loc => loc.id === 'event-island')
                  if (location) setOpenModal({ type: 'event-island', location })
                }}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                이벤트
              </button>
            </div>

            {/* 기본 안내 메시지 */}
            <div className="card">
              <div className="text-center py-8">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-5xl mb-4"
                >
                  🗺️
                </motion.div>
                <h3 className="text-xl font-bold mb-2">정령의 섬에 오신 것을 환영합니다!</h3>
                <p className="text-gray-600 mb-4">
                  지도에서 장소를 클릭하거나 상단 메뉴를 사용하여 다양한 기능을 이용하세요.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-1">🏠</div>
                    <div className="text-xs text-gray-600">원소 홈</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl mb-1">🛒</div>
                    <div className="text-xs text-gray-600">상점</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">📦</div>
                    <div className="text-xs text-gray-600">보관함</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs text-gray-600">대회</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

