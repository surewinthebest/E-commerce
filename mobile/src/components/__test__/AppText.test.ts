import { textStyle } from "../AppText";
import { Font, Typography } from "@/src/models/Font";

describe("AppText - textStyle data mapping", () => {
  it("should contain style configurations for all Typography keys defined in textStyle", () => {
    expect(textStyle).toBeDefined();
    expect(typeof textStyle).toEqual("object");
  });

  describe("Specific Typography Mappings", () => {
    it("should correctly define regular variant styles (e.g., textBase)", () => {
      const baseStyle = textStyle[Typography.textBase];

      expect(baseStyle).toEqual({
        fontFamily: Font.NunitoSansRegular,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "400",
      });
    });

    it("should correctly define bold variant styles (e.g., textBaseB)", () => {
      const baseBoldStyle = textStyle[Typography.textBaseB];

      expect(baseBoldStyle).toEqual({
        fontFamily: Font.NunitoSansBold,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "700",
      });
    });

    it("should correctly define black/weight-900 variant styles (e.g., text4Point5XlBlack)", () => {
      const blackStyle = textStyle[Typography.text4Point5XlBlack];

      expect(blackStyle).toEqual({
        fontFamily: Font.NunitoSansBlack,
        fontSize: 40,
        lineHeight: 48,
        fontWeight: "900",
      });
    });

    it("should correctly define styles without explicit fontWeight if omitted (e.g., text4Point5Xl)", () => {
      const style = textStyle[Typography.text4Point5Xl];

      expect(style.fontFamily).toBe(Font.NunitoSansRegular);
      expect(style.fontSize).toBe(40);
      expect(style.lineHeight).toBe(48);
      expect(style.fontWeight).toBeUndefined();
    });
  });

  describe("Style Property Integrity", () => {
    it("should ensure every defined style has valid numeric fontSize and lineHeight", () => {
      Object.keys(textStyle).forEach((key) => {
        const typographyKey = key as Typography;
        const style = textStyle[typographyKey];

        expect(typeof style.fontSize).toBe("number");
        expect(style.fontSize).toBeGreaterThan(0);

        expect(typeof style.lineHeight).toBe("number");
        expect(style.lineHeight).toBeGreaterThan(0);
      });
    });

    it("should ensure every defined style maps to a valid Font value", () => {
      const validFonts = Object.values(Font);

      Object.keys(textStyle).forEach((key) => {
        const typographyKey = key as Typography;
        const style = textStyle[typographyKey];

        expect(validFonts).toContain(style.fontFamily);
      });
    });
  });
});