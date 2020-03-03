import typescript from '@rollup/plugin-typescript';
// import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'umd',
                name: 'WebArchiveStream',
                sourcemap: true
            },
            {
                file: 'dist/index.mjs',
                format: 'es',
                sourcemap: true
            }
        ],
        plugins: [
            typescript({
                tsconfig: 'tsconfig.json',
                declaration: false,
                declarationMap: false
            })
        ]
    }
]
