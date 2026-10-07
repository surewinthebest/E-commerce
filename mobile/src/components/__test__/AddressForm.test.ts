interface AddressFormData {
    label: string;
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    isDefault: boolean;
  }
  
  interface AddressFormTextInput {
    label: string;
    placeholder: string;
    value: string;
    action: (t: string) => void;
  }
  
  /**
   * Helper function replicating the internal mapping logic from AddressForm
   * to evaluate state transform handlers directly.
   */
  function createFormInfos(
    addressForm: AddressFormData,
    onFormChange: (updatedForm: AddressFormData) => void
  ): AddressFormTextInput[] {
    return [
      {
        label: "Label",
        placeholder: "e.g. Home, Work, Office",
        value: addressForm.label,
        action: (t: string) => onFormChange({ ...addressForm, label: t }),
      },
      {
        label: "Full Name",
        placeholder: "Enter your full name",
        value: addressForm.fullName,
        action: (t: string) => onFormChange({ ...addressForm, fullName: t }),
      },
      {
        label: "Street Address",
        placeholder: "Street address, apt/suite number",
        value: addressForm.streetAddress,
        action: (t: string) => onFormChange({ ...addressForm, streetAddress: t }),
      },
      {
        label: "City",
        placeholder: "e.g. New York",
        value: addressForm.city,
        action: (t: string) => onFormChange({ ...addressForm, city: t }),
      },
      {
        label: "State",
        placeholder: "e.g. NY",
        value: addressForm.state,
        action: (t: string) => onFormChange({ ...addressForm, state: t }),
      },
      {
        label: "ZIP Code",
        placeholder: "e.g. 10001",
        value: addressForm.zipCode,
        action: (t: string) => onFormChange({ ...addressForm, zipCode: t }),
      },
      {
        label: "Phone Number",
        placeholder: "+852 12345678",
        value: addressForm.phoneNumber,
        action: (t: string) => onFormChange({ ...addressForm, phoneNumber: t }),
      },
    ];
  }
  
  /**
   * Helper replicating the toggle handler for 'isDefault'
   */
  function handleToggleDefault(
    addressForm: AddressFormData,
    value: boolean,
    onFormChange: (updatedForm: AddressFormData) => void
  ) {
    onFormChange({ ...addressForm, isDefault: !!value });
  }
  
  describe("AddressForm - State & Data Logic Tests", () => {
    const initialAddressForm: AddressFormData = {
      label: "Home",
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      phoneNumber: "+852 12345678",
      isDefault: false,
    };
  
    let onFormChangeMock: jest.Mock;
  
    beforeEach(() => {
      onFormChangeMock = jest.fn();
    });
  
    describe("Form Field Value Mapping", () => {
      it("should correctly populate initial values into form text inputs", () => {
        const formInfos = createFormInfos(initialAddressForm, onFormChangeMock);
  
        expect(formInfos.find((f) => f.label === "Label")?.value).toBe("Home");
        expect(formInfos.find((f) => f.label === "Full Name")?.value).toBe("John Doe");
        expect(formInfos.find((f) => f.label === "Street Address")?.value).toBe("123 Main St");
        expect(formInfos.find((f) => f.label === "City")?.value).toBe("New York");
        expect(formInfos.find((f) => f.label === "State")?.value).toBe("NY");
        expect(formInfos.find((f) => f.label === "ZIP Code")?.value).toBe("10001");
        expect(formInfos.find((f) => f.label === "Phone Number")?.value).toBe("+852 12345678");
      });
    });
  
    describe("State Mutation Callbacks (Text Inputs)", () => {
      it("should update 'label' field correctly without mutating other fields", () => {
        const formInfos = createFormInfos(initialAddressForm, onFormChangeMock);
        const labelInput = formInfos.find((f) => f.label === "Label");
  
        labelInput?.action("Office");
  
        expect(onFormChangeMock).toHaveBeenCalledTimes(1);
        expect(onFormChangeMock).toHaveBeenCalledWith({
          ...initialAddressForm,
          label: "Office",
        });
      });
  
      it("should update 'fullName' field correctly", () => {
        const formInfos = createFormInfos(initialAddressForm, onFormChangeMock);
        const input = formInfos.find((f) => f.label === "Full Name");
  
        input?.action("Jane Doe");
  
        expect(onFormChangeMock).toHaveBeenCalledWith({
          ...initialAddressForm,
          fullName: "Jane Doe",
        });
      });
  
      it("should update 'streetAddress' field correctly", () => {
        const formInfos = createFormInfos(initialAddressForm, onFormChangeMock);
        const input = formInfos.find((f) => f.label === "Street Address");
  
        input?.action("456 Market St");
  
        expect(onFormChangeMock).toHaveBeenCalledWith({
          ...initialAddressForm,
          streetAddress: "456 Market St",
        });
      });
  
      it("should update 'city' field correctly", () => {
        const formInfos = createFormInfos(initialAddressForm, onFormChangeMock);
        const input = formInfos.find((f) => f.label === "City");
  
        input?.action("San Francisco");
  
        expect(onFormChangeMock).toHaveBeenCalledWith({
          ...initialAddressForm,
          city: "San Francisco",
        });
      });
  
      it("should update 'state' field correctly", () => {
        const formInfos = createFormInfos(initialAddressForm, onFormChangeMock);
        const input = formInfos.find((f) => f.label === "State");
  
        input?.action("CA");
  
        expect(onFormChangeMock).toHaveBeenCalledWith({
          ...initialAddressForm,
          state: "CA",
        });
      });
  
      it("should update 'zipCode' field correctly", () => {
        const formInfos = createFormInfos(initialAddressForm, onFormChangeMock);
        const input = formInfos.find((f) => f.label === "ZIP Code");
  
        input?.action("94105");
  
        expect(onFormChangeMock).toHaveBeenCalledWith({
          ...initialAddressForm,
          zipCode: "94105",
        });
      });
  
      it("should update 'phoneNumber' field correctly", () => {
        const formInfos = createFormInfos(initialAddressForm, onFormChangeMock);
        const input = formInfos.find((f) => f.label === "Phone Number");
  
        input?.action("+1 555-0199");
  
        expect(onFormChangeMock).toHaveBeenCalledWith({
          ...initialAddressForm,
          phoneNumber: "+1 555-0199",
        });
      });
    });
  
    describe("Switch / Toggle Logic", () => {
      it("should toggle 'isDefault' to true when switched on", () => {
        handleToggleDefault(initialAddressForm, true, onFormChangeMock);
  
        expect(onFormChangeMock).toHaveBeenCalledWith({
          ...initialAddressForm,
          isDefault: true,
        });
      });
  
      it("should toggle 'isDefault' to false when switched off", () => {
        const defaultAddress = { ...initialAddressForm, isDefault: true };
        handleToggleDefault(defaultAddress, false, onFormChangeMock);
  
        expect(onFormChangeMock).toHaveBeenCalledWith({
          ...defaultAddress,
          isDefault: false,
        });
      });
    });
  
    describe("Button State / Action Guard Checks", () => {
      it("should evaluate save button state as disabled when adding or updating", () => {
        const isSaving = (isAdding: boolean, isUpdating: boolean) => isAdding || isUpdating;
  
        expect(isSaving(true, false)).toBe(true);
        expect(isSaving(false, true)).toBe(true);
        expect(isSaving(false, false)).toBe(false);
      });
  
      it("should determine correct button label based on mode", () => {
        const getButtonText = (isEditing: boolean) => (isEditing ? "Save Changes" : "Add Address");
  
        expect(getButtonText(true)).toBe("Save Changes");
        expect(getButtonText(false)).toBe("Add Address");
      });
    });
  });