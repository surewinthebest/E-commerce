import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import AddressesScreen from '@/src/app/(profile)/addresses';
import useAddresses from '@/src/hooks/useAddresses';
import { Address } from '@/src/types';

// 1. Mock the custom hook
jest.mock('@/src/hooks/useAddresses');

// 2. Mock vector icons to avoid native font loading errors
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

// 3. Mock ProfileHeader with explicit component name
jest.mock('@/src/components/ProfileHeader', () => {
    const MockProfileHeader = ({ children, screenTitle }: any) => (
        <View testID="profile-header">
            <Text>{screenTitle}</Text>
            {children}
        </View>
    );
    MockProfileHeader.displayName = 'MockProfileHeader';
    return MockProfileHeader;
});

// 4. Mock child card and form components with explicit component names
jest.mock('@/src/components/AdressCard', () => {
    const MockAddressCard = ({ item, handleEdit, handleDelete }: any) => (
        <View testID={`address-card-${item._id}`}>
            <Text>{item.label}</Text>
            <Text>{item.streetAddress}</Text>
            <TouchableOpacity onPress={() => handleEdit(item)} testID={`edit-btn-${item._id}`}>
                <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} testID={`delete-btn-${item._id}`}>
                <Text>Delete</Text>
            </TouchableOpacity>
        </View>
    );
    MockAddressCard.displayName = 'MockAddressCard';
    return MockAddressCard;
});

jest.mock('@/src/components/AddressForm', () => {
    const MockAddressForm = ({ showAddressForm, isEditing, onSave, onClose }: any) => {
        if (!showAddressForm) return null;
        return (
            <View testID="address-form-modal">
                <Text>{isEditing ? 'Editing Mode' : 'Adding Mode'}</Text>
                <TouchableOpacity onPress={onSave} testID="form-save-btn">
                    <Text>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} testID="form-close-btn">
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
        );
    };
    MockAddressForm.displayName = 'MockAddressForm';
    return MockAddressForm;
});

// Mock Alert spy
jest.spyOn(Alert, 'alert');

const mockUseAddresses = useAddresses as jest.MockedFunction<typeof useAddresses>;

const mockAddresses: Address[] = [
    {
        _id: '1',
        label: 'Home',
        fullName: 'John Doe',
        streetAddress: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        phoneNumber: '1234567890',
        isDefault: true,
    },
];

describe('AddressesScreen', () => {
    const mockAddAddress = jest.fn();
    const mockUpdateAddress = jest.fn();
    const mockDeleteAddress = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAddresses.mockReturnValue({
            addresses: [],
            isLoading: false,
            isError: false,
            addAddress: mockAddAddress,
            isAddingAddress: false,
            updateAddress: mockUpdateAddress,
            isUpdatingAddress: false,
            deleteAddress: mockDeleteAddress,
            isDeletingAddress: false,
        });
    });

    it('renders empty list state when no addresses exist', async () => {
        const { getByText, queryByTestId } = await render(<AddressesScreen />);

        expect(getByText('No address yet')).toBeTruthy();
        expect(getByText('Add your first delivery address')).toBeTruthy();
        expect(getByText('Add Address')).toBeTruthy();
        expect(queryByTestId('address-card-1')).toBeNull();
    });

    it('renders list of addresses and "Add New Address" footer when addresses exist', async () => {
        mockUseAddresses.mockReturnValue({
            addresses: mockAddresses,
            isLoading: false,
            isError: false,
            addAddress: mockAddAddress,
            isAddingAddress: false,
            updateAddress: mockUpdateAddress,
            isUpdatingAddress: false,
            deleteAddress: mockDeleteAddress,
            isDeletingAddress: false,
        });

        const { getByText, getByTestId } = await render(<AddressesScreen />);

        expect(getByTestId('address-card-1')).toBeTruthy();
        expect(getByText('Home')).toBeTruthy();
        expect(getByText('123 Main St')).toBeTruthy();
        expect(getByText(/Add New Address/i)).toBeTruthy();
    });

    it('opens address form in "Adding Mode" when Add Address button is pressed', async () => {
        const { getByText, getByTestId } = await render(<AddressesScreen />);

        fireEvent.press(getByText('Add Address'));

        expect(getByTestId('address-form-modal')).toBeTruthy();
        expect(getByText('Adding Mode')).toBeTruthy();
    });

    it('opens address form in "Editing Mode" when edit button on card is pressed', async () => {
        mockUseAddresses.mockReturnValue({
            addresses: mockAddresses,
            isLoading: false,
            isError: false,
            addAddress: mockAddAddress,
            isAddingAddress: false,
            updateAddress: mockUpdateAddress,
            isUpdatingAddress: false,
            deleteAddress: mockDeleteAddress,
            isDeletingAddress: false,
        });

        const { getByTestId, getByText } = await render(<AddressesScreen />);

        fireEvent.press(getByTestId('edit-btn-1'));

        expect(getByTestId('address-form-modal')).toBeTruthy();
        expect(getByText('Editing Mode')).toBeTruthy();
    });

    it('triggers Alert confirmation when delete button is pressed on an address card', async () => {
        mockUseAddresses.mockReturnValue({
            addresses: mockAddresses,
            isLoading: false,
            isError: false,
            addAddress: mockAddAddress,
            isAddingAddress: false,
            updateAddress: mockUpdateAddress,
            isUpdatingAddress: false,
            deleteAddress: mockDeleteAddress,
            isDeletingAddress: false,
        });

        const { getByTestId } = await render(<AddressesScreen />);

        fireEvent.press(getByTestId('delete-btn-1'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Delete Address',
            'Are you sure to delete this address?',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
                expect.objectContaining({ text: 'Delete', style: 'destructive' }),
            ])
        );
    });

    it('executes deleteAddress when confirm delete is pressed in Alert', async () => {
        mockUseAddresses.mockReturnValue({
            addresses: mockAddresses,
            isLoading: false,
            isError: false,
            addAddress: mockAddAddress,
            isAddingAddress: false,
            updateAddress: mockUpdateAddress,
            isUpdatingAddress: false,
            deleteAddress: mockDeleteAddress,
            isDeletingAddress: false,
        });

        const { getByTestId } = await render(<AddressesScreen />);

        fireEvent.press(getByTestId('delete-btn-1'));

        // Extract the Alert buttons parameter and trigger the 'Delete' button's onPress callback
        const alertCalls = (Alert.alert as jest.Mock).mock.calls;
        const alertButtons = alertCalls[0][2];
        const deleteButton = alertButtons.find((btn: any) => btn.text === 'Delete');

        act(() => {
            deleteButton.onPress();
        });

        expect(mockDeleteAddress).toHaveBeenCalledWith('1');
    });

    it('calls addAddress when saving a new address in the form', async () => {
        const { getByText, getByTestId } = await render(<AddressesScreen />);

        // 1. Open form
        fireEvent.press(getByText('Add Address'));

        // 2. Click Save
        fireEvent.press(getByTestId('form-save-btn'));

        expect(mockAddAddress).toHaveBeenCalledTimes(1);
        expect(mockAddAddress).toHaveBeenCalledWith(
            expect.objectContaining({
                label: '',
                fullName: '',
                streetAddress: '',
            }),
            expect.any(Object)
        );
    });

    it('calls updateAddress when saving changes to an existing address in the form', async () => {
        mockUseAddresses.mockReturnValue({
            addresses: mockAddresses,
            isLoading: false,
            isError: false,
            addAddress: mockAddAddress,
            isAddingAddress: false,
            updateAddress: mockUpdateAddress,
            isUpdatingAddress: false,
            deleteAddress: mockDeleteAddress,
            isDeletingAddress: false,
        });

        const { getByTestId } = await render(<AddressesScreen />);

        // 1. Click edit on address '1'
        fireEvent.press(getByTestId('edit-btn-1'));

        // 2. Click Save
        fireEvent.press(getByTestId('form-save-btn'));

        expect(mockUpdateAddress).toHaveBeenCalledTimes(1);
        expect(mockUpdateAddress).toHaveBeenCalledWith(
            {
                addressId: '1',
                addressData: expect.objectContaining({
                    label: 'Home',
                    streetAddress: '123 Main St',
                }),
            },
            expect.any(Object)
        );
    });
});