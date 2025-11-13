import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../../stores/authStore'
import { authService } from '../../services/authService'

// Mock authService
jest.mock('../../services/authService', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}))

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.logout()
    })
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        coins: 1000,
      }

      ;(authService.register as jest.Mock).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'testpassword123',
        })
      })

      expect(authService.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123',
      })
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  describe('login', () => {
    it('should login a user', async () => {
      const mockToken = {
        access_token: 'test-token',
        token_type: 'bearer',
      }
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        coins: 1000,
      }

      ;(authService.login as jest.Mock).mockResolvedValue(mockToken)
      ;(authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.login({
          username: 'testuser',
          password: 'testpassword123',
        })
      })

      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpassword123',
      })
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  describe('logout', () => {
    it('should logout a user', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })
})

