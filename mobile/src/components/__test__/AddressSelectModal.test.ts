import { Alert } from 'react-native';
import { Address, ShippingAddress } from '@/src/types';

// Mock react-native's Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Re-creating or extracting the pure reordering logic for testing
const getReorderedAddressList = (addressList: Address[]): Address[] | null => {
  if (!addressList || addressList.length === 0) return null;
  const defaultAddress: Address = addressList.filter((addr) => addr.isDefault)[0];
  if (!defaultAddress) return addressList;
  const selectedIndex = addressList.findIndex((addr) => addr.isDefault);
  const remainingAddressList = addressList.toSpliced(selectedIndex, 1);
  return [defaultAddress, ...remainingAddressList];
};

// Re-creating or extracting the pure continue handling logic for testing
const handleOnPressContinueLogic = (
  shippingAddressId: string,
  addressList: Address[],
  onPressContinue: (addr: ShippingAddress) => void
) => {
  if (shippingAddressId === '') {
    Alert.alert('Error', 'No Shipping Address selected', [{ text: 'OK', style: 'default' }]);
    return;
  }
  const selected: Address = addressList.filter((addr) => addr._id === shippingAddressId)[0];
  if (!selected) return;

  const selectedAddress: ShippingAddress = {
    fullName: selected.fullName,
    streetAddress: selected.streetAddress,
    city: selected.city,
    state: selected.state,
    zipCode: selected.zipCode,
    phoneNumber: selected.phoneNumber,
  };
  onPressContinue(selectedAddress);
};

// Mock Data Fixtures
const mockAddresses: Address[] = [
  {
    _id: '1',
    label: 'Home',
    fullName: 'Jane Doe',
    streetAddress: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    phoneNumber: '555-1234',
    isDefault: false,
  },
  {
    _id: '2',
    label: 'Work',
    fullName: 'John Smith',
    streetAddress: '456 Market St',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    phoneNumber: '555-5678',
    isDefault: true,
  },
];

describe('AddressSelectModal Data State & Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('reorderedAddressList logic', () => {
    it('should return null when address list is empty or undefined', () => {
      expect(getReorderedAddressList([])).toBeNull();
      expect(getReorderedAddressList(undefined as unknown as Address[])).toBeNull();
    });

    it('should place default address first when present', () => {
      const result = getReorderedAddressList(mockAddresses);

      expect(result).not.toBeNull();
      expect(result?.length).toBe(2);
      expect(result![0]._id).toBe('2'); // 'Work' is default, should be moved to first position
      expect(result![1]._id).toBe('1');
    });

    it('should maintain original order if no default address exists', () => {
      const nonDefaultList = mockAddresses.map((addr) => ({ ...addr, isDefault: false }));
      const result = getReorderedAddressList(nonDefaultList);

      expect(result).toEqual(nonDefaultList);
    });
  });

  describe('handleOnPressContinue logic', () => {
    it('should trigger Alert.alert when no shipping address ID is selected', () => {
      const mockOnPressContinue = jest.fn();

      handleOnPressContinueLogic('', mockAddresses, mockOnPressContinue);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'No Shipping Address selected',
        [{ text: 'OK', style: 'default' }]
      );
      expect(mockOnPressContinue).not.toHaveBeenCalled();
    });

    it('should transform selected Address to ShippingAddress format and call callback', () => {
      const mockOnPressContinue = jest.fn();

      handleOnPressContinueLogic('1', mockAddresses, mockOnPressContinue);

      const expectedShippingAddress: ShippingAddress = {
        fullName: 'Jane Doe',
        streetAddress: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        phoneNumber: '555-1234',
      };

      expect(mockOnPressContinue).toHaveBeenCalledTimes(1);
      expect(mockOnPressContinue).toHaveBeenCalledWith(expectedShippingAddress);
    });

    it('should do nothing if selected ID does not match any address in the list', () => {
      const mockOnPressContinue = jest.fn();

      handleOnPressContinueLogic('non-existent-id', mockAddresses, mockOnPressContinue);

      expect(Alert.alert).not.toHaveBeenCalled();
      expect(mockOnPressContinue).not.toHaveBeenCalled();
    });
  });
});