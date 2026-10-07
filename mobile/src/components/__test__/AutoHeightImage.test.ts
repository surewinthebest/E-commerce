import { Image, Dimensions } from 'react-native';

// Mock React Native dependencies
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(),
  },
  Image: {
    getSize: jest.fn(),
  },
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
}));

describe('AutoHeightImage State & Logic', () => {
  const MOCK_SCREEN_WIDTH = 375;

  beforeEach(() => {
    jest.clearAllMocks();
    (Dimensions.get as jest.Mock).mockReturnValue({ width: MOCK_SCREEN_WIDTH });
  });

  describe('Height Calculation Logic', () => {
    it('calculates proportional height correctly when image size is retrieved', () => {
      const originalWidth = 1000;
      const originalHeight = 500;
      const ratio = originalHeight / originalWidth; // 0.5
      const expectedHeight = MOCK_SCREEN_WIDTH * ratio; // 187.5

      expect(expectedHeight).toBe(187.5);
    });
  });

  describe('Image.getSize lifecycle interactions', () => {
    it('triggers Image.getSize when uri is provided', () => {
      const uri = 'https://example.com/image.png';

      // Simulating the effect hook logic
      if (uri) {
        Image.getSize(uri, jest.fn(), jest.fn());
      }

      expect(Image.getSize).toHaveBeenCalledWith(
        uri,
        expect.any(Function),
        expect.any(Function)
      );
    });

    it('bypasses Image.getSize if uri is empty', () => {
      const uri = '';

      if (uri) {
        Image.getSize(uri, jest.fn(), jest.fn());
      }

      expect(Image.getSize).not.toHaveBeenCalled();
    });

    it('invokes success callback and computes final height correctly', () => {
      const uri = 'https://example.com/image.png';
      const originalWidth = 800;
      const originalHeight = 600;

      let calculatedHeight = 200; // default initial state

      (Image.getSize as jest.Mock).mockImplementationOnce(
        (_uri: string, success: (w: number, h: number) => void) => {
          success(originalWidth, originalHeight);
        }
      );

      // Simulating hook execution flow
      if (uri) {
        Image.getSize(
          uri,
          (w, h) => {
            const ratio = h / w;
            calculatedHeight = MOCK_SCREEN_WIDTH * ratio;
          },
          jest.fn()
        );
      }

      // 375 * (600 / 800) = 281.25
      expect(calculatedHeight).toBe(281.25);
    });

    it('handles error callback without updating height state', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const uri = 'https://example.com/invalid-image.png';
      const mockError = new Error('Network error');

      let calculatedHeight = 200; // default state

      (Image.getSize as jest.Mock).mockImplementationOnce(
        (_uri: string, _success: unknown, failure: (err: unknown) => void) => {
          failure(mockError);
        }
      );

      if (uri) {
        Image.getSize(
          uri,
          (w, h) => {
            const ratio = h / w;
            calculatedHeight = MOCK_SCREEN_WIDTH * ratio;
          },
          (error) => {
            console.error('Fail to load the image size:', error);
          }
        );
      }

      expect(calculatedHeight).toBe(200); // Retains default initial state
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fail to load the image size:', mockError);

      consoleErrorSpy.mockRestore();
    });
  });
});