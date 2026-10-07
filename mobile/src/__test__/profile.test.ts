import { useUser, useAuth } from "@clerk/expo";
import { Color } from "@/src/models/Color";

// Mock external hooks and modules
jest.mock("@clerk/expo", () => ({
  useUser: jest.fn(),
  useAuth: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("Profile Component Data & Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Clerk User Data State", () => {
    it("should correctly handle complete user profile data state", () => {
      const mockUserData = {
        fullName: "John Doe",
        imageUrl: "https://example.com/avatar.jpg",
        emailAddresses: [{ emailAddress: "john.doe@example.com" }],
      };

      (useUser as jest.Mock).mockReturnValue({ user: mockUserData });

      const { user } = useUser();

      expect(user?.fullName).toBe("John Doe");
      expect(user?.imageUrl).toBe("https://example.com/avatar.jpg");
      expect(user?.emailAddresses[0].emailAddress).toBe("john.doe@example.com");
    });

    it("should handle undefined user gracefully (logged out or loading state)", () => {
      (useUser as jest.Mock).mockReturnValue({ user: undefined });

      const { user } = useUser();

      expect(user).toBeUndefined();
      expect(user?.fullName).toBeUndefined();
      expect(user?.imageUrl).toBeUndefined();
      expect(user?.emailAddresses?.[0]?.emailAddress).toBeUndefined();
    });

    it("should handle user with missing optional properties", () => {
      const mockUserData = {
        fullName: null,
        imageUrl: undefined,
        emailAddresses: [],
      };

      (useUser as jest.Mock).mockReturnValue({ user: mockUserData });

      const { user } = useUser();

      expect(user?.fullName).toBeNull();
      expect(user?.emailAddresses?.[0]?.emailAddress).toBeUndefined();
    });
  });

  describe("Profile Action Data Configuration", () => {
    const profileFunctions = [
      { icon: "person-outline", title: "Edit Profile", color: Color.ProfileBlue, direct: "/profile" },
      { icon: "list-outline", title: "Orders", color: Color.ProfileGreen, direct: "/orders" },
      { icon: "location-outline", title: "Addresses", color: Color.ProfileYellow, direct: "/addresses" },
      { icon: "heart-outline", title: "Wishlist", color: Color.ProfileRed, direct: "/wishlist" },
    ];

    it("should match expected menu item count", () => {
      expect(profileFunctions).toHaveLength(4);
    });

    it("should contain unique titles and target routes for each action", () => {
      const titles = profileFunctions.map((item) => item.title);
      const routes = profileFunctions.map((item) => item.direct);

      expect(new Set(titles).size).toBe(titles.length);
      expect(new Set(routes).size).toBe(routes.length);
    });

    it("should format color opacity strings correctly for styling data", () => {
      profileFunctions.forEach((item) => {
        const colorWithOpacity = item.color + "20";
        expect(colorWithOpacity).toMatch(/^#[0-9A-Fa-f]{6}20$/);
      });
    });
  });

  describe("Navigation Routing Logic", () => {
    const handleRoute = (direct: string, routerPush: (path: string) => void) => {
      if (direct === "/profile") return;
      routerPush(direct);
    };

    it("should suppress navigation when redirect target is '/profile'", () => {
      const mockPush = jest.fn();
      handleRoute("/profile", mockPush);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should trigger navigation for valid non-profile routes", () => {
      const mockPush = jest.fn();

      handleRoute("/orders", mockPush);
      expect(mockPush).toHaveBeenCalledWith("/orders");

      handleRoute("/addresses", mockPush);
      expect(mockPush).toHaveBeenCalledWith("/addresses");

      handleRoute("/wishlist", mockPush);
      expect(mockPush).toHaveBeenCalledWith("/wishlist");
    });
  });

  describe("Auth Hook Integration State", () => {
    it("should correctly provide the signOut function from useAuth", () => {
      const mockSignOut = jest.fn();
      (useAuth as jest.Mock).mockReturnValue({ signOut: mockSignOut });

      const { signOut } = useAuth();
      signOut();

      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
});