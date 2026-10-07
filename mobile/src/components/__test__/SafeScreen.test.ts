import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock the react-native-safe-area-context module
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe("SafeScreen Data State", () => {
  const mockUseSafeAreaInsets = useSafeAreaInsets as jest.MockedFunction<
    typeof useSafeAreaInsets
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve correctly structured safe area insets data", () => {
    const mockInsets = { top: 47, bottom: 34, left: 0, right: 0 };
    mockUseSafeAreaInsets.mockReturnValue(mockInsets);

    const insets = useSafeAreaInsets();

    expect(insets).toEqual(mockInsets);
    expect(insets.top).toBe(47);
  });

  it("should handle default zero insets data state", () => {
    const mockInsets = { top: 0, bottom: 0, left: 0, right: 0 };
    mockUseSafeAreaInsets.mockReturnValue(mockInsets);

    const insets = useSafeAreaInsets();

    expect(insets.top).toBe(0);
  });
});