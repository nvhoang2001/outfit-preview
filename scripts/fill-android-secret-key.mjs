import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import _ from 'lodash';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFileName = '.env.release.android';
const envFilePath = path.resolve(projectRoot, envFileName);
const gradlePropertiesFilePath = path.resolve(projectRoot, 'android', 'gradle.properties');

const envConfig =
  dotenv.config({
    path: envFilePath,
  }).parsed ?? {};

if (_.isEmpty(envConfig)) {
  console.error('Failed to read signing secret data!\n');
  console.error('Generate signing key follow react native Google Play Store Publish instruction');

  throw new Error(`Empty or non-exists ${envFileName} file`);
}

const gradleConfigFileContent = fs.readFileSync(gradlePropertiesFilePath, {
  encoding: 'utf-8',
});

const gradleConfigContentLines = gradleConfigFileContent.split('\n');

for (const configKey in envConfig) {
  const configValue = envConfig[configKey];
  const configLineIndex = gradleConfigContentLines.findIndex(line => line.startsWith(configKey));
  if (configLineIndex < 0) {
    gradleConfigContentLines.push(`${configKey}=${configValue}`);
  } else {
    gradleConfigContentLines[configLineIndex] = `${configKey}=${configValue}`;
  }
}

const updatedGradleConfig = gradleConfigContentLines.join('\n');
fs.writeFileSync(gradlePropertiesFilePath, updatedGradleConfig, { encoding: 'utf-8' });

console.log('-----------------\n');
console.log('Updated release data into gradle.properties file\n');
