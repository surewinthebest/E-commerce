import { describe, it, expect } from '@jest/globals';

describe("InvariantSizeText data state logic", () => {
    it("should default allowFontScaling to false when no props are provided", () => {
        const props = {};
        const { allowFontScaling = false, ...restProps } = props;

        expect(allowFontScaling).toBe(false);
        expect(restProps).toEqual({});
    });

    it("should preserve allowFontScaling when explicitly set to true", () => {
        const props = { allowFontScaling: true, children: "Hello World" };
        const { allowFontScaling = false, ...restProps } = props;

        expect(allowFontScaling).toBe(true);
        expect(restProps).toEqual({ children: "Hello World" });
    });

    it("should forward rest props unchanged without mutating them", () => {
        const customProps = {
            children: "Test Text",
            numberOfLines: 2,
            style: { color: "red" },
            testID: "invariant-text-id",
        };

        const { allowFontScaling = false, ...restProps } = customProps;

        expect(allowFontScaling).toBe(false);
        expect(restProps).toEqual({
            children: "Test Text",
            numberOfLines: 2,
            style: { color: "red" },
            testID: "invariant-text-id",
        });
    });
});