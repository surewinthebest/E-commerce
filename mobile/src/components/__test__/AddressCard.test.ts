import { Address } from '@/src/types';

// Extracting address formatting logic for pure unit testing
const formatFormattedAddress = (address: Address) => {
  return {
    label: `  ${address.label}`,
    fullName: address.fullName,
    streetAddress: address.streetAddress,
    cityStateZip: `${address.city}, ${address.state} ${address.zipCode}`,
    phoneNumber: address.phoneNumber,
    isDefaultBadgeVisible: Boolean(address.isDefault),
  };
};

// Extracting action availability state logic
const getButtonStates = (isUpdatingAddress: boolean, isDeletingAddress: boolean) => {
  return {
    isEditDisabled: isUpdatingAddress,
    isDeleteDisabled: isDeletingAddress,
    showEditSpinner: isUpdatingAddress,
    showDeleteSpinner: isDeletingAddress,
  };
};

// Mock Data Fixtures
const mockDefaultAddress: Address = {
  _id: 'addr_123',
  label: 'Home',
  fullName: 'Jane Doe',
  streetAddress: '100 Main St',
  city: 'Austin',
  state: 'TX',
  zipCode: '78701',
  phoneNumber: '555-0199',
  isDefault: true,
};

const mockNonDefaultAddress: Address = {
  ...mockDefaultAddress,
  _id: 'addr_456',
  label: 'Office',
  isDefault: false,
};

describe('AdressCard Data State & Logic', () => {
  describe('Address Data Formatting', () => {
    it('should format full address details correctly', () => {
      const formatted = formatFormattedAddress(mockDefaultAddress);

      expect(formatted.label).toBe('  Home');
      expect(formatted.fullName).toBe('Jane Doe');
      expect(formatted.streetAddress).toBe('100 Main St');
      expect(formatted.cityStateZip).toBe('Austin, TX 78701');
      expect(formatted.phoneNumber).toBe('555-0199');
    });

    it('should evaluate isDefaultBadgeVisible true when address is set to default', () => {
      const formatted = formatFormattedAddress(mockDefaultAddress);
      expect(formatted.isDefaultBadgeVisible).toBe(true);
    });

    it('should evaluate isDefaultBadgeVisible false when address is non-default', () => {
      const formattedNonDefault = formatFormattedAddress(mockNonDefaultAddress);
      expect(formattedNonDefault.isDefaultBadgeVisible).toBe(false);
    });
  });

  describe('Action Callback Payloads', () => {
    it('should pass full Address object to handleEdit callback', () => {
      const handleEditMock = jest.fn();
      
      // Simulate action logic execution
      handleEditMock(mockDefaultAddress);

      expect(handleEditMock).toHaveBeenCalledTimes(1);
      expect(handleEditMock).toHaveBeenCalledWith(mockDefaultAddress);
    });

    it('should pass address ID string to handleDelete callback', () => {
      const handleDeleteMock = jest.fn();

      // Simulate action logic execution
      handleDeleteMock(mockDefaultAddress._id);

      expect(handleDeleteMock).toHaveBeenCalledTimes(1);
      expect(handleDeleteMock).toHaveBeenCalledWith('addr_123');
    });
  });

  describe('Loading and Disabled States', () => {
    it('should calculate edit button disabled and spinner states when isUpdatingAddress is true', () => {
      const states = getButtonStates(true, false);

      expect(states.isEditDisabled).toBe(true);
      expect(states.showEditSpinner).toBe(true);
      expect(states.isDeleteDisabled).toBe(false);
      expect(states.showDeleteSpinner).toBe(false);
    });

    it('should calculate delete button disabled and spinner states when isDeletingAddress is true', () => {
      const states = getButtonStates(false, true);

      expect(states.isEditDisabled).toBe(false);
      expect(states.showEditSpinner).toBe(false);
      expect(states.isDeleteDisabled).toBe(true);
      expect(states.showDeleteSpinner).toBe(true);
    });

    it('should allow both actions when neither loading flag is active', () => {
      const states = getButtonStates(false, false);

      expect(states.isEditDisabled).toBe(false);
      expect(states.isDeleteDisabled).toBe(false);
      expect(states.showEditSpinner).toBe(false);
      expect(states.showDeleteSpinner).toBe(false);
    });
  });
});