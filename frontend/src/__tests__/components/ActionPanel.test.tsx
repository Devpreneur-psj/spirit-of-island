import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActionPanel from '../../components/ActionPanel'
import { useSpiritlingStore } from '../../stores/spiritlingStore'

// Mock the store
jest.mock('../../stores/spiritlingStore')

const mockSpiritling = {
  id: '1',
  name: 'Test Spiritling',
  element: 'fire',
  level: 1,
  experience: 0,
  stats: {
    health: 10,
    agility: 10,
    intelligence: 10,
    friendliness: 10,
    resilience: 10,
    luck: 10,
  },
  status: {
    hunger: 80,
    happiness: 80,
    energy: 80,
    health: 80,
    cleanliness: 80,
  },
  growthStage: 'infant',
  personality: 'playful',
  currentAction: 'idle',
  actionData: {},
  user_id: 'user1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('ActionPanel', () => {
  const mockFeedSpiritling = jest.fn()
  const mockPlayWithSpiritling = jest.fn()
  const mockHealSpiritling = jest.fn()
  const mockCleanSpiritling = jest.fn()
  const mockTrainSpiritling = jest.fn()

  beforeEach(() => {
    (useSpiritlingStore as any).mockReturnValue({
      feedSpiritling: mockFeedSpiritling,
      playWithSpiritling: mockPlayWithSpiritling,
      healSpiritling: mockHealSpiritling,
      cleanSpiritling: mockCleanSpiritling,
      trainSpiritling: mockTrainSpiritling,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders action buttons', () => {
    render(<ActionPanel spiritling={mockSpiritling} />)
    
    expect(screen.getByLabelText(/먹이 주기/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/놀기/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/치료하기/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/씻기기/i)).toBeInTheDocument()
  })

  it('calls feedSpiritling when feed button is clicked', async () => {
    const user = userEvent.setup()
    render(<ActionPanel spiritling={mockSpiritling} />)
    
    const feedButton = screen.getByLabelText(/먹이 주기/i)
    await user.click(feedButton)
    
    await waitFor(() => {
      expect(mockFeedSpiritling).toHaveBeenCalledWith('1')
    })
  })

  it('calls playWithSpiritling when play button is clicked', async () => {
    const user = userEvent.setup()
    render(<ActionPanel spiritling={mockSpiritling} />)
    
    const playButton = screen.getByLabelText(/놀기/i)
    await user.click(playButton)
    
    await waitFor(() => {
      expect(mockPlayWithSpiritling).toHaveBeenCalledWith('1')
    })
  })

  it('disables train button when energy is low', () => {
    const lowEnergySpiritling = {
      ...mockSpiritling,
      status: {
        ...mockSpiritling.status,
        energy: 10,
      },
    }
    
    render(<ActionPanel spiritling={lowEnergySpiritling} />)
    
    const trainButton = screen.getByLabelText(/훈련하기/i)
    expect(trainButton).toBeDisabled()
  })
})

