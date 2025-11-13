import { authService } from '../../services/authService'
import api from '../../services/api'

// Mock API
jest.mock('../../services/api', () => ({
  post: jest.fn(),
  get: jest.fn(),
}))

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('should register a new user', async () => {
      const mockResponse = {
        data: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
        },
      }

      ;(api.post as jest.Mock).mockResolvedValue(mockResponse)

      const result = await authService.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123',
      })

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123',
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('login', () => {
    it('should login a user', async () => {
      const mockResponse = {
        data: {
          access_token: 'test-token',
          token_type: 'bearer',
        },
      }

      ;(api.post as jest.Mock).mockResolvedValue(mockResponse)

      const result = await authService.login({
        username: 'testuser',
        password: 'testpassword123',
      })

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'testpassword123',
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user', async () => {
      const mockResponse = {
        data: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          coins: 1000,
        },
      }

      ;(api.get as jest.Mock).mockResolvedValue(mockResponse)

      const result = await authService.getCurrentUser()

      expect(api.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockResponse.data)
    })
  })
})

