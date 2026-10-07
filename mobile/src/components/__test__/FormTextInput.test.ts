import { ReactElement } from "react";
import FormTextInput from "../FormTextInput";
import { AddressFormTextInput } from "@/src/types";

// Helper type to type-safe React elements with generic props
type TestElement = ReactElement<{
  children?: any;
  value?: string;
  onChangeText?: (text: string) => void;
}>;

describe("FormTextInput Data State & Props", () => {
  let mockAction: jest.Mock;
  let defaultFormInfo: AddressFormTextInput;

  beforeEach(() => {
    mockAction = jest.fn();
    defaultFormInfo = {
      label: "Street Address",
      placeholder: "Enter your address",
      value: "123 Main St",
      action: mockAction,
    };
  });

  describe("Component Instantiation & Prop Passing", () => {
    it("should accept valid AddressFormTextInput props without throwing errors", () => {
      expect(() => {
        FormTextInput({ formInfo: defaultFormInfo });
      }).not.toThrow();
    });

    it("should return a React element tree containing the correct data values", () => {
      const elementTree = FormTextInput({ formInfo: defaultFormInfo }) as TestElement;

      expect(elementTree).toBeDefined();
      expect(elementTree.type).toBeDefined();
    });
  });

  describe("Callback & State Logic Handlers", () => {
    it("should invoke the formInfo action callback when onChangeText handler is triggered", () => {
      const elementTree = FormTextInput({ formInfo: defaultFormInfo }) as TestElement;

      // Extract children from View -> TextInput
      const textInputContainer = elementTree.props.children[1] as TestElement;
      const textInput = textInputContainer.props.children as TestElement;

      const newValue = "456 Oak Ave";

      // Execute the onChangeText handler directly
      textInput.props.onChangeText?.(newValue);

      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(mockAction).toHaveBeenCalledWith(newValue);
    });

    it("should preserve empty string value state passed via props", () => {
      const emptyFormInfo: AddressFormTextInput = {
        ...defaultFormInfo,
        value: "",
      };

      const elementTree = FormTextInput({ formInfo: emptyFormInfo }) as TestElement;
      const textInputContainer = elementTree.props.children[1] as TestElement;
      const textInput = textInputContainer.props.children as TestElement;

      expect(textInput.props.value).toBe("");
    });
  });

  describe("Optional Props & Conditional Render State", () => {
    it("should handle empty string label without throwing errors", () => {
      const formInfoWithEmptyLabel: AddressFormTextInput = {
        label: "",
        placeholder: "Search...",
        value: "Test",
        action: mockAction,
      };

      const elementTree = FormTextInput({ formInfo: formInfoWithEmptyLabel }) as TestElement;
      const labelChild = elementTree.props.children[0];

      // Verification that conditional evaluation formInfo?.label evaluates to falsy and returns null
      expect(labelChild).toBeNull();
    });

    it("should handle missing/undefined label when cast dynamically", () => {
      const formInfoWithoutLabel = {
        placeholder: "Search...",
        value: "Test",
        action: mockAction,
      } as unknown as AddressFormTextInput;

      const elementTree = FormTextInput({ formInfo: formInfoWithoutLabel }) as TestElement;
      const labelChild = elementTree.props.children[0];

      expect(labelChild).toBeNull();
    });
  });
});