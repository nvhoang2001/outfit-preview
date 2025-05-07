import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envExampleFilePath = path.resolve(projectRoot, '.env.example');
const declarationFilePath = path.resolve(projectRoot, 'src', '@types', 'react-native-config.d.ts');

fs.readFile(envExampleFilePath, (err, fileData) => {
  if (err) {
    console.log('Failed to parse env file. Detail: ');
    console.log(err);

    return;
  }

  const fileContent = fileData.toString('utf8');
  const envList = fileContent.split('\n').filter(line => {
    return Boolean(line.trim() && !line.startsWith('#'));
  });
  const envName = envList.map(envItem => envItem.split('=')[0]);
  const envItemsDeclarations = envName.map(name => `${name}?: string;`).join('\n');
  const declarationContent =
    //
    `declare module 'react-native-config' {
  export interface NativeConfig {
    ${envItemsDeclarations}
  }

  export const Config: NativeConfig;
  export default Config;
}
`;

  fs.writeFile(declarationFilePath, declarationContent, err => {
    if (err) {
      console.log('Failed to update env declaration. Detail: ');
      console.log(err);

      return;
    }

    console.log('Success update env content');
  });
});
