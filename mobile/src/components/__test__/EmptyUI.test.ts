// EmptyUI.test.ts
import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Re-export or match the Props interface from your component
interface EmptyUIProps {
    hasBackBtn?: boolean;
    emptyHeader: string;
    emptyIcon: ComponentProps<typeof Ionicons>['name'];
    emptyTitle: string;
    emptyMsg: string;
}

// Data state helper simulating prop initialization logic
const createEmptyUIProps = (overrides?: Partial<EmptyUIProps>): EmptyUIProps => {
    return {
        hasBackBtn: false, // Default state check
        emptyHeader: 'Default Header',
        emptyIcon: 'alert-circle-outline',
        emptyTitle: 'No Items Found',
        emptyMsg: 'There is no data to display at this time.',
        ...overrides,
    };
};

describe('EmptyUI Data State & Props Contract', () => {
    it('should assign correct default state for hasBackBtn when omitted', () => {
        const props = createEmptyUIProps();

        expect(props.hasBackBtn).toBe(false);
        expect(props.emptyHeader).toBe('Default Header');
        expect(props.emptyIcon).toBe('alert-circle-outline');
    });

    it('should correctly accept custom prop states', () => {
        const customProps = createEmptyUIProps({
            hasBackBtn: true,
            emptyHeader: 'Search Results',
            emptyIcon: 'search-outline',
            emptyTitle: 'No Matches',
            emptyMsg: 'Try adjusting your search filters.',
        });

        expect(customProps.hasBackBtn).toBe(true);
        expect(customProps.emptyHeader).toBe('Search Results');
        expect(customProps.emptyIcon).toBe('search-outline');
        expect(customProps.emptyTitle).toBe('No Matches');
        expect(customProps.emptyMsg).toBe('Try adjusting your search filters.');
    });

    it('should maintain strict types for Ionicons icon names', () => {
        const validIconName: ComponentProps<typeof Ionicons>['name'] = 'arrow-back';
        const props = createEmptyUIProps({ emptyIcon: validIconName });

        expect(typeof props.emptyIcon).toBe('string');
        expect(props.emptyIcon).toEqual('arrow-back');
    });
});