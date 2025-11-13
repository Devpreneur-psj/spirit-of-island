import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { rankingService, Ranking, RankingList as RankingListType } from '../services/rankingService'

export default function RankingList() {
  const [category, setCategory] = useState('overall')
  const [period, setPeriod] = useState('all_time')
  const [rankings, setRankings] = useState<RankingListType | null>(null)
  const [myRanking, setMyRanking] = useState<Ranking | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchRankings()
    fetchMyRanking()
  }, [category, period])

  const fetchRankings = async () => {
    try {
      setIsLoading(true)
      const data = await rankingService.getRankings(category, period, 100)
      setRankings(data)
    } catch (error) {
      console.error('Failed to fetch rankings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMyRanking = async () => {
    try {
      const data = await rankingService.getMyRanking(category, period)
      setMyRanking(data)
    } catch (error) {
      console.error('Failed to fetch my ranking:', error)
    }
  }

  const categories = [
    { value: 'overall', label: '전체', icon: '🏆' },
    { value: 'level', label: '레벨', icon: '📈' },
    { value: 'coins', label: '코인', icon: '💰' },
    { value: 'spiritlings', label: '마정령 수', icon: '🦄' },
  ]

  const periods = [
    { value: 'all_time', label: '전체' },
    { value: 'daily', label: '일간' },
    { value: 'weekly', label: '주간' },
    { value: 'monthly', label: '월간' },
  ]

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg sm:text-xl font-bold mb-4">랭킹</h3>
        
        {/* 카테고리 및 기간 선택 */}
        <div className="space-y-4 mb-4">
          <div>
            <label className="text-xs sm:text-sm font-medium mb-2 block">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                    category === cat.value
                      ? 'bg-pastel-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.label}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xs sm:text-sm font-medium mb-2 block">기간</label>
            <div className="flex flex-wrap gap-2">
              {periods.map((p) => (
                <motion.button
                  key={p.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPeriod(p.value)}
                  className={`px-3 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                    period === p.value
                      ? 'bg-pastel-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* 내 랭킹 */}
        {myRanking && (
          <div className="mb-4 p-3 bg-pastel-purple/20 rounded-lg">
            <p className="text-xs sm:text-sm font-medium mb-1">내 랭킹</p>
            <p className="text-lg sm:text-xl font-bold text-pastel-purple">
              {myRanking.rank}위 (점수: {myRanking.score})
            </p>
          </div>
        )}

        {/* 랭킹 목록 */}
        {isLoading ? (
          <p className="text-gray-500 text-center py-4 text-sm">로딩 중...</p>
        ) : rankings && rankings.rankings.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm">랭킹 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rankings?.rankings.map((ranking, index) => (
              <motion.div
                key={ranking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border-2 ${
                  ranking.rank === 1
                    ? 'bg-yellow-50 border-yellow-300'
                    : ranking.rank === 2
                    ? 'bg-gray-50 border-gray-300'
                    : ranking.rank === 3
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-bold text-base sm:text-lg w-6 sm:w-8 text-center flex-shrink-0">
                      {ranking.rank === 1 && '🥇'}
                      {ranking.rank === 2 && '🥈'}
                      {ranking.rank === 3 && '🥉'}
                      {ranking.rank > 3 && ranking.rank}
                    </span>
                    <span className="font-medium text-sm sm:text-base truncate">
                      {ranking.user?.username || 'Unknown'}
                    </span>
                  </div>
                  <span className="font-bold text-pastel-purple text-sm sm:text-base flex-shrink-0">
                    {ranking.score.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

