import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Competition } from '../types'
import { competitionService, CompetitionRanking } from '../services/competitionService'
import { useSpiritlingStore } from '../stores/spiritlingStore'

export default function CompetitionList() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [ranking, setRanking] = useState<CompetitionRanking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { selectedSpiritling, fetchSpiritlings } = useSpiritlingStore()

  useEffect(() => {
    fetchCompetitions()
  }, [])

  useEffect(() => {
    if (selectedCompetition) {
      fetchRanking(selectedCompetition.id)
    }
  }, [selectedCompetition])

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true)
      const data = await competitionService.getCompetitions()
      setCompetitions(data)
    } catch (error) {
      console.error('Failed to fetch competitions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRanking = async (competitionId: string) => {
    try {
      const data = await competitionService.getCompetitionRanking(competitionId)
      setRanking(data)
    } catch (error) {
      console.error('Failed to fetch ranking:', error)
    }
  }

  const handleEnterCompetition = async (competition: Competition) => {
    if (!selectedSpiritling) {
      alert('마정령을 선택해주세요.')
      return
    }

    try {
      await competitionService.enterCompetition(competition.id, selectedSpiritling.id)
      alert('대회에 참가했습니다!')
      await fetchRanking(competition.id)
      await fetchSpiritlings()
    } catch (error: any) {
      alert(error.response?.data?.detail || '대회 참가에 실패했습니다.')
    }
  }

  const getCompetitionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      race: '🏃 경주',
      puzzle: '🧩 퍼즐',
      battle: '⚔️ 전투',
      fashion: '👗 코디',
    }
    return labels[type] || type
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      ended: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg sm:text-xl font-bold mb-4">대회 목록</h3>
        {isLoading ? (
          <p className="text-gray-500 text-center py-4 text-sm">로딩 중...</p>
        ) : competitions.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm">진행 중인 대회가 없습니다.</p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {competitions.map((competition) => (
              <motion.div
                key={competition.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-base sm:text-lg truncate">{competition.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(competition.status)}`}>
                    {competition.status === 'upcoming' && '예정'}
                    {competition.status === 'active' && '진행중'}
                    {competition.status === 'ended' && '종료'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{competition.description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-medium">{getCompetitionTypeLabel(competition.type)}</span>
                  <div className="flex gap-2">
                    {competition.status === 'active' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEnterCompetition(competition)}
                        disabled={!selectedSpiritling}
                        className="btn-primary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed py-2 px-3 sm:px-4"
                      >
                        참가하기
                      </motion.button>
                    )}
                    {competition.status === 'upcoming' && (
                      <button
                        onClick={() => setSelectedCompetition(competition)}
                        className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4"
                      >
                        상세보기
                      </button>
                    )}
                    {competition.status === 'ended' && (
                      <button
                        onClick={() => setSelectedCompetition(competition)}
                        className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4"
                      >
                        결과보기
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedCompetition && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold truncate flex-1 min-w-0">{selectedCompetition.name} 랭킹</h3>
            <button
              onClick={() => setSelectedCompetition(null)}
              className="text-gray-500 hover:text-gray-700 flex-shrink-0 ml-2 min-w-[24px] min-h-[24px] flex items-center justify-center"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
          {ranking.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">랭킹 데이터가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {ranking.map((entry) => (
                <div
                  key={entry.spiritling_id}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-2"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="font-bold text-base sm:text-lg w-6 sm:w-8 text-center flex-shrink-0">
                      {entry.rank === 1 && '🥇'}
                      {entry.rank === 2 && '🥈'}
                      {entry.rank === 3 && '🥉'}
                      {entry.rank > 3 && entry.rank}
                    </span>
                    <span className="font-medium text-sm sm:text-base truncate">{entry.spiritling_name}</span>
                  </div>
                  <span className="font-bold text-pastel-purple text-sm sm:text-base flex-shrink-0">{entry.score.toFixed(1)}점</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

