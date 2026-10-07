// app.config.ts
import { ConfigContext, ExpoConfig } from 'expo/config';
import { withProjectBuildGradle } from '@expo/config-plugins';

export default ({ config }: ConfigContext): ExpoConfig => {
  const fullConfig: ExpoConfig = {
    ...config,
    name: config.name ?? 'mobile',
    slug: config.slug ?? 'mobile',
  };

  return withProjectBuildGradle(fullConfig, (modConfig) => {
    let contents = modConfig.modResults.contents;

    const jacksonFix = `
buildscript {
    configurations.classpath {
        resolutionStrategy {
            force 'com.fasterxml.jackson.core:jackson-core:2.15.2'
            force 'com.fasterxml.jackson.core:jackson-databind:2.15.2'
            force 'com.fasterxml.jackson.core:jackson-annotations:2.15.2'
        }
    }
}
`;

    if (!contents.includes('jackson-databind')) {
      contents += jacksonFix;
    }

    modConfig.modResults.contents = contents;
    return modConfig;
  });
};