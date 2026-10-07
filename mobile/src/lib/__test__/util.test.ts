import { capitalizeFirstLetter, formatDate, getStatusColor } from '../utils';
import { Color } from '@/src/models/Color';

describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a lowercase string', () => {
        expect(capitalizeFirstLetter('hello')).toBe('Hello');
    });

    it('should leave an already capitalized string unchanged', () => {
        expect(capitalizeFirstLetter('World')).toBe('World');
    });

    it('should handle single character strings', () => {
        expect(capitalizeFirstLetter('a')).toBe('A');
    });

    it('should return an empty string when passed an empty string', () => {
        expect(capitalizeFirstLetter('')).toBe('');
    });
});

describe('formatDate', () => {
    it('should format a valid ISO date string correctly', () => {
        // Mock or pass a fixed UTC/date format to avoid timezone shifts
        const result = formatDate('2026-09-24T00:00:00Z');
        expect(result).toBe('Sep 24, 2026');
    });

    it('should format a standard YYYY-MM-DD date string', () => {
        const result = formatDate('2025-01-01');
        expect(result).toContain('2025');
        expect(result).toContain('Jan');
    });
});

describe('getStatusColor', () => {
    it('should return ProfileYellow for pending status', () => {
        expect(getStatusColor('pending')).toBe(Color.ProfileYellow);
        expect(getStatusColor('PENDING')).toBe(Color.ProfileYellow);
    });

    it('should return ProfileGreen for delivered status', () => {
        expect(getStatusColor('delivered')).toBe(Color.ProfileGreen);
        expect(getStatusColor('Delivered')).toBe(Color.ProfileGreen);
    });

    it('should return ProfileBlue for shipped status', () => {
        expect(getStatusColor('shipped')).toBe(Color.ProfileBlue);
        expect(getStatusColor('SHIPPED')).toBe(Color.ProfileBlue);
    });

    it('should default to ProfileBlue for unrecognized status strings', () => {
        expect(getStatusColor('unknown')).toBe(Color.ProfileBlue);
        expect(getStatusColor('')).toBe(Color.ProfileBlue);
    });
});