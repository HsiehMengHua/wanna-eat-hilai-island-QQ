import { createJsWithTsEsmPreset, type JestConfigWithTsJest } from 'ts-jest';

const presetConfig = createJsWithTsEsmPreset({
  //...options
});

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
};

export default jestConfig;