import { useState } from 'react';

export interface SettingFunction {
  id: string;
  title: string;
  description: string;
  rightHandSidecomponent?: 'navigation' | 'toggle';
  value?: boolean;
}

export interface SettingScreen {
  header: string;
  fns: SettingFunction[];
}

export const usePrivacyAndSecurity = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [marketingEmailsEnabled, setMarketingEmailsEnabled] = useState(false);
  const [shareDataEnabled, setShareDataEnabled] = useState(false);

  const onPressToggle = (id: string, value: boolean) => {
    switch (id) {
      case 'two-factor':
        setTwoFactorEnabled(value);
        break;
      case 'biometric':
        setBiometricEnabled(value);
        break;
      case 'push-noti':
        setPushNotificationsEnabled(value);
        break;
      case 'email':
        setEmailNotificationsEnabled(value);
        break;
      case 'marketing':
        setMarketingEmailsEnabled(value);
        break;
      case 'share-data':
        setShareDataEnabled(value);
        break;
    }
  };

  const securityFn: SettingFunction[] = [
    {
      id: 'password',
      title: 'Change Password',
      description: 'Update your account password',
      rightHandSidecomponent: 'navigation',
    },
    {
      id: 'two-factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      rightHandSidecomponent: 'toggle',
      value: twoFactorEnabled,
    },
    {
      id: 'biometric',
      title: 'Biometric Login',
      description: 'Use Face ID or Touch ID',
      rightHandSidecomponent: 'toggle',
      value: biometricEnabled,
    },
  ];

  const privacyFn: SettingFunction[] = [
    {
      id: 'push-noti',
      title: 'Push Notifications',
      description: 'Receive push notifications',
      rightHandSidecomponent: 'toggle',
      value: pushNotificationsEnabled,
    },
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive order updates via email',
      rightHandSidecomponent: 'toggle',
      value: emailNotificationsEnabled,
    },
    {
      id: 'marketing',
      title: 'Marketing Emails',
      description: 'Receive promotional emails',
      rightHandSidecomponent: 'toggle',
      value: marketingEmailsEnabled,
    },
    {
      id: 'share-data',
      title: 'Share Usage Data',
      description: 'Help us improve the app',
      rightHandSidecomponent: 'toggle',
      value: shareDataEnabled,
    },
  ];

  const accountSettings: SettingFunction[] = [
    {
      id: 'activity',
      title: 'Account Activity',
      description: 'View recent login activity',
      rightHandSidecomponent: 'navigation',
    },
    {
      id: 'connect-devices',
      title: 'Connected Devices',
      description: 'Manage devices with access',
      rightHandSidecomponent: 'navigation',
    },
    {
      id: 'data-download',
      title: 'Download Your Data',
      description: 'Get a copy of your data',
      rightHandSidecomponent: 'navigation',
    },
  ];

  const settingFn: SettingScreen[] = [
    { header: 'Security', fns: securityFn },
    { header: 'Privacy', fns: privacyFn },
    { header: 'Account', fns: accountSettings },
  ];

  return {
    states: {
      twoFactorEnabled,
      biometricEnabled,
      pushNotificationsEnabled,
      emailNotificationsEnabled,
      marketingEmailsEnabled,
      shareDataEnabled,
    },
    settingFn,
    onPressToggle,
  };
};