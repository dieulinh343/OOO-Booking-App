import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-node-externals';
import json from '@rollup/plugin-json';
import svg from 'rollup-plugin-svg';

const folders = ['components', 'constants', 'hooks', 'middlewares', 'utils'];

export default [{
  input: folders.map(folder => `./src/${folder}/index.ts`),
  output: [
    {
      format: 'esm',
      sourcemap: true,
      dir: '.',
      preserveModules: true,
    },
  ],
  plugins: [
    external(),
    json(),
    svg({
      base64: true,
    }),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
}];
