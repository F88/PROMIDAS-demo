/**
 * @file Unit tests for sessionStorage-based token helpers.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getApiToken,
  setApiToken,
  removeApiToken,
  hasApiToken,
} from '../../token/token-storage';

describe('token-storage', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('getApiToken', () => {
    it('returns null when no token is stored', () => {
      expect(getApiToken()).toBeNull();
    });

    it('returns the stored token when it exists', () => {
      const token = 'test-api-token-123';
      sessionStorage.setItem('protopedia_api_token', token);
      expect(getApiToken()).toBe(token);
    });

    it('returns null after token is removed', () => {
      sessionStorage.setItem('protopedia_api_token', 'test-token');
      sessionStorage.removeItem('protopedia_api_token');
      expect(getApiToken()).toBeNull();
    });
  });

  describe('setApiToken', () => {
    it('stores the token in sessionStorage', () => {
      const token = 'my-secret-token';
      setApiToken(token);
      expect(sessionStorage.getItem('protopedia_api_token')).toBe(token);
    });

    it('overwrites existing token', () => {
      setApiToken('old-token');
      setApiToken('new-token');
      expect(sessionStorage.getItem('protopedia_api_token')).toBe('new-token');
    });

    it('stores empty string token', () => {
      setApiToken('');
      expect(sessionStorage.getItem('protopedia_api_token')).toBe('');
    });
  });

  describe('removeApiToken', () => {
    it('removes the token from sessionStorage', () => {
      sessionStorage.setItem('protopedia_api_token', 'test-token');
      removeApiToken();
      expect(sessionStorage.getItem('protopedia_api_token')).toBeNull();
    });

    it('does nothing when no token exists', () => {
      // Should not throw error
      expect(() => removeApiToken()).not.toThrow();
      expect(sessionStorage.getItem('protopedia_api_token')).toBeNull();
    });
  });

  describe('hasApiToken', () => {
    it('returns false when no token is stored', () => {
      expect(hasApiToken()).toBe(false);
    });

    it('returns true when a token is stored', () => {
      sessionStorage.setItem('protopedia_api_token', 'test-token');
      expect(hasApiToken()).toBe(true);
    });

    it('returns false after token is removed', () => {
      sessionStorage.setItem('protopedia_api_token', 'test-token');
      removeApiToken();
      expect(hasApiToken()).toBe(false);
    });

    it('returns true even for empty string token', () => {
      sessionStorage.setItem('protopedia_api_token', '');
      expect(hasApiToken()).toBe(true);
    });
  });

  describe('edge cases', () => {
    describe('storage failures', () => {
      it('handles storage quota exceeded gracefully', () => {
        // Mock setItem to throw quota exceeded error
        const originalSetItem = sessionStorage.setItem;
        sessionStorage.setItem = vi.fn(() => {
          throw new DOMException('QuotaExceededError');
        });

        // Should not throw, error is caught and logged
        expect(() => setApiToken('token')).not.toThrow();

        sessionStorage.setItem = originalSetItem;
      });
    });

    describe('token content', () => {
      it('handles special characters in tokens', () => {
        const specialToken = 'token-with-!@#$%^&*()_+={}[]|\\:";<>?,./';
        setApiToken(specialToken);
        expect(getApiToken()).toBe(specialToken);
      });

      it('handles very long tokens', () => {
        const longToken = 'a'.repeat(10000);
        setApiToken(longToken);
        expect(getApiToken()).toBe(longToken);
      });
    });

    describe('other keys', () => {
      it('maintains independence from other sessionStorage keys', () => {
        sessionStorage.setItem('other-key', 'other-value');
        setApiToken('api-token');
        expect(sessionStorage.getItem('other-key')).toBe('other-value');
        expect(getApiToken()).toBe('api-token');
      });
    });
  });
});
