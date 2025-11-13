import { render, screen } from '@testing-library/react'
import SpiritlingProfile from '../../components/SpiritlingProfile'
import { Spiritling } from '../../types'

const mockSpiritling: Spiritling = {
  id: '1',
  name: 'Testling',
  element: 'fire',
  personality: 'playful',
  growth_stage: 'infant',
  level: 5,
  experience: 50,
  health_stat: 80,
  agility_stat: 70,
  intelligence_stat: 60,
  friendliness_stat: 75,
  resilience_stat: 65,
  luck_stat: 55,
  hunger: 90,
  happiness: 85,
  energy: 80,
  health_status: 95,
  cleanliness: 90,
  current_action: 'idle',
  action_data: {},
  user_id: 'user1',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
}

describe('SpiritlingProfile', () => {
  it('renders spiritling information correctly', () => {
    render(<SpiritlingProfile spiritling={mockSpiritling} />)
    
    expect(screen.getByText('Testling')).toBeInTheDocument()
    expect(screen.getByText('레벨 5')).toBeInTheDocument()
    expect(screen.getByText(/경험치/)).toBeInTheDocument()
  })

  it('displays all stats', () => {
    render(<SpiritlingProfile spiritling={mockSpiritling} />)
    
    expect(screen.getByText(/체력/)).toBeInTheDocument()
    expect(screen.getByText(/민첩/)).toBeInTheDocument()
    expect(screen.getByText(/지능/)).toBeInTheDocument()
    expect(screen.getByText(/친근함/)).toBeInTheDocument()
  })

  it('displays status information', () => {
    render(<SpiritlingProfile spiritling={mockSpiritling} />)
    
    expect(screen.getByText(/배고픔/)).toBeInTheDocument()
    expect(screen.getByText(/행복도/)).toBeInTheDocument()
    expect(screen.getByText(/에너지/)).toBeInTheDocument()
  })
})

