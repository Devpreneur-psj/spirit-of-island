import { render, screen, waitFor } from '@testing-library/react'
import ItemShop from '../../components/ItemShop'
import { useAuthStore } from '../../stores/authStore'
import { useItemStore } from '../../stores/itemStore'
import { itemService } from '../../services/itemService'

// Mock stores
jest.mock('../../stores/authStore', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('../../stores/itemStore', () => ({
  useItemStore: jest.fn(),
}))

jest.mock('../../services/itemService', () => ({
  itemService: {
    getItems: jest.fn(),
    buyItem: jest.fn(),
  },
}))

describe('ItemShop', () => {
  beforeEach(() => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 'user1', username: 'testuser', coins: 1000 },
      isAuthenticated: true,
    })

    (useItemStore as jest.Mock).mockReturnValue({
      buyItem: jest.fn(),
    })

    (itemService.getItems as jest.Mock).mockResolvedValue([
      {
        id: '1',
        name: 'Test Food',
        type: 'food',
        description: 'Test food item',
        effect: { status: 'hunger', value: 20 },
        price: 100,
        rarity: 'common',
      },
    ])
  })

  it('renders item shop correctly', async () => {
    render(<ItemShop />)
    
    await waitFor(() => {
      expect(screen.getByText('상점')).toBeInTheDocument()
    })
  })

  it('displays items when loaded', async () => {
    render(<ItemShop />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Food')).toBeInTheDocument()
    })
  })
})

