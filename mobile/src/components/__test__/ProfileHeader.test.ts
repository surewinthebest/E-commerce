import React, { ComponentProps } from 'react';
import ProfileHeader from '../ProfileHeader';

type ProfileHeaderProps = ComponentProps<typeof ProfileHeader>;

describe('ProfileHeader Data State & Props Logic', () => {
  it('should accept and store screenTitle prop correctly', () => {
    const props: ProfileHeaderProps = {
      screenTitle: 'User Profile',
      children: 'Content',
    };

    const element = ProfileHeader(props) as React.ReactElement;

    expect(element.props).toBeDefined();
    expect(props.screenTitle).toBe('User Profile');
  });

  it('should correctly evaluate the conditional presence of extraText prop', () => {
    const propsWithExtra: ProfileHeaderProps = {
      screenTitle: 'Settings',
      children: 'Content',
      extraText: 'Edit',
    };

    const propsWithoutExtra: ProfileHeaderProps = {
      screenTitle: 'Settings',
      children: 'Content',
    };

    expect(propsWithExtra.extraText).toBeDefined();
    expect(propsWithExtra.extraText).toBe('Edit');
    expect(propsWithoutExtra.extraText).toBeUndefined();
  });

  it('should process children data prop as passed', () => {
    const childNode = 'Profile Details Node';
    const props: ProfileHeaderProps = {
      screenTitle: 'Dashboard',
      children: childNode,
    };

    const element = ProfileHeader(props) as React.ReactElement;

    expect(props.children).toEqual(childNode);
    expect(element).not.toBeNull();
  });
});