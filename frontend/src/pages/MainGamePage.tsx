import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useSpiritlingStore } from '../stores/spiritlingStore'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import WorldMapView from '../components/WorldMapView'
import LevelUpNotification from '../components/LevelUpNotification'
import { Location } from '../config/locations'
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
import VillageModal from '../components/VillageModal'

export default function MainGamePage() {
  const { user, logout, fetchCurrentUser } = useAuthStore()
  const { spiritlings, fetchSpiritlings, selectedSpiritling, previousLevel } = useSpiritlingStore()
  const [activeTab, setActiveTab] = useState<'spiritling' | 'shop' | 'inventory' | 'competition' | 'friends' | 'ranking' | 'achievements' | 'events'>('spiritling')
  const [showVillageModal, setShowVillageModal] = useState(false)

  // Memoize handlers to prevent unnecessary re-renders
  const handleTabChange = useCallback((tab: 'spiritling' | 'shop' | 'inventory' | 'competition' | 'friends' | 'ranking' | 'achievements' | 'events') => {
    setActiveTab(tab)
  }, [])

  const handleLocationClick = useCallback((location: Location) => {
    if (location.id === 'village-square') {
      // 마을은 별도 모달로 열림
      setShowVillageModal(true)
    } else if (location.tab) {
      handleTabChange(location.tab as any)
    }
  }, [handleTabChange])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  // Memoize user coins to prevent unnecessary re-renders
  const userCoins = useMemo(() => user?.coins || 0, [user?.coins])

  // Keyboard navigation for tabs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return // Ignore Ctrl/Cmd combinations
      
      const tabs: Array<'spiritling' | 'shop' | 'inventory' | 'competition' | 'friends' | 'ranking' | 'achievements' | 'events'> = [
        'spiritling', 'shop', 'inventory', 'competition', 'friends', 'ranking', 'achievements', 'events'
      ]
      const currentIndex = tabs.indexOf(activeTab)
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % tabs.length
        handleTabChange(tabs[nextIndex])
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length
        handleTabChange(tabs[prevIndex])
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, handleTabChange])

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
              currentTab={activeTab}
            />
          </motion.div>

          {/* 마을 모달 */}
          {showVillageModal && (
            <VillageModal onClose={() => setShowVillageModal(false)} />
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
                onClick={() => handleTabChange('spiritling')}
                role="tab"
                aria-selected={activeTab === 'spiritling'}
                aria-controls="spiritling-tabpanel"
                id="spiritling-tab"
                tabIndex={activeTab === 'spiritling' ? 0 : -1}
                className={`px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 ${
                  activeTab === 'spiritling'
                    ? 'text-pastel-purple border-b-2 border-pastel-purple'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                마정령
              </button>
              <button
                onClick={() => handleTabChange('shop')}
                role="tab"
                aria-selected={activeTab === 'shop'}
                aria-controls="shop-tabpanel"
                id="shop-tab"
                tabIndex={activeTab === 'shop' ? 0 : -1}
                className={`px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 ${
                  activeTab === 'shop'
                    ? 'text-pastel-purple border-b-2 border-pastel-purple'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                상점
              </button>
              <button
                onClick={() => handleTabChange('inventory')}
                role="tab"
                aria-selected={activeTab === 'inventory'}
                aria-controls="inventory-tabpanel"
                id="inventory-tab"
                tabIndex={activeTab === 'inventory' ? 0 : -1}
                className={`px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 ${
                  activeTab === 'inventory'
                    ? 'text-pastel-purple border-b-2 border-pastel-purple'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                인벤토리
              </button>
              <button
                onClick={() => handleTabChange('competition')}
                role="tab"
                aria-selected={activeTab === 'competition'}
                aria-controls="competition-tabpanel"
                id="competition-tab"
                tabIndex={activeTab === 'competition' ? 0 : -1}
                className={`px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 ${
                  activeTab === 'competition'
                    ? 'text-pastel-purple border-b-2 border-pastel-purple'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                대회
              </button>
              <button
                onClick={() => handleTabChange('friends')}
                role="tab"
                aria-selected={activeTab === 'friends'}
                aria-controls="friends-tabpanel"
                id="friends-tab"
                tabIndex={activeTab === 'friends' ? 0 : -1}
                className={`px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 ${
                  activeTab === 'friends'
                    ? 'text-pastel-purple border-b-2 border-pastel-purple'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                친구
              </button>
              <button
                onClick={() => setShowVillageModal(true)}
                role="button"
                className="px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 text-gray-600 hover:text-gray-800"
              >
                마을
              </button>
              <button
                onClick={() => handleTabChange('ranking')}
                role="tab"
                aria-selected={activeTab === 'ranking'}
                aria-controls="ranking-tabpanel"
                id="ranking-tab"
                tabIndex={activeTab === 'ranking' ? 0 : -1}
                className={`px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 ${
                  activeTab === 'ranking'
                    ? 'text-pastel-purple border-b-2 border-pastel-purple'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                랭킹
              </button>
              <button
                onClick={() => handleTabChange('achievements')}
                role="tab"
                aria-selected={activeTab === 'achievements'}
                aria-controls="achievements-tabpanel"
                id="achievements-tab"
                tabIndex={activeTab === 'achievements' ? 0 : -1}
                className={`px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 ${
                  activeTab === 'achievements'
                    ? 'text-pastel-purple border-b-2 border-pastel-purple'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                업적
              </button>
              <button
                onClick={() => handleTabChange('events')}
                role="tab"
                aria-selected={activeTab === 'events'}
                aria-controls="events-tabpanel"
                id="events-tab"
                tabIndex={activeTab === 'events' ? 0 : -1}
                className={`px-2 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors whitespace-nowrap min-w-fit focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:ring-offset-2 ${
                  activeTab === 'events'
                    ? 'text-pastel-purple border-b-2 border-pastel-purple'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                이벤트
              </button>
            </div>

            {/* 탭 컨텐츠 */}
            {activeTab === 'spiritling' && (
              <div role="tabpanel" id="spiritling-tabpanel" aria-labelledby="spiritling-tab">
                <Suspense fallback={<TabLoadingFallback />}>
                  {selectedSpiritling ? (
                    <>
                      <SpiritlingProfile spiritling={selectedSpiritling} />
                      <ActionPanel spiritling={selectedSpiritling} />
                      <ActionLog spiritlingId={selectedSpiritling.id} />
                    </>
                  ) : (
                    <div className="card">
                      <h3 className="text-xl font-bold mb-4">마정령 목록</h3>
                      <SpiritlingList spiritlings={spiritlings} />
                    </div>
                  )}
                </Suspense>
              </div>
            )}

            {activeTab === 'shop' && (
              <div role="tabpanel" id="shop-tabpanel" aria-labelledby="shop-tab">
                <Suspense fallback={<TabLoadingFallback />}>
                  <ItemShop />
                </Suspense>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div role="tabpanel" id="inventory-tabpanel" aria-labelledby="inventory-tab">
                <Suspense fallback={<TabLoadingFallback />}>
                  <Inventory />
                </Suspense>
              </div>
            )}

            {activeTab === 'competition' && (
              <div role="tabpanel" id="competition-tabpanel" aria-labelledby="competition-tab">
                <Suspense fallback={<TabLoadingFallback />}>
                  <CompetitionList />
                </Suspense>
              </div>
            )}

            {activeTab === 'friends' && (
              <div role="tabpanel" id="friends-tabpanel" aria-labelledby="friends-tab">
                <Suspense fallback={<TabLoadingFallback />}>
                  <FriendList />
                </Suspense>
              </div>
            )}

            {activeTab === 'ranking' && (
              <div role="tabpanel" id="ranking-tabpanel" aria-labelledby="ranking-tab">
                <Suspense fallback={<TabLoadingFallback />}>
                  <RankingList />
                </Suspense>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div role="tabpanel" id="achievements-tabpanel" aria-labelledby="achievements-tab">
                <Suspense fallback={<TabLoadingFallback />}>
                  <AchievementList />
                </Suspense>
              </div>
            )}

            {activeTab === 'events' && (
              <div role="tabpanel" id="events-tabpanel" aria-labelledby="events-tab">
                <Suspense fallback={<TabLoadingFallback />}>
                  <EventList />
                </Suspense>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

