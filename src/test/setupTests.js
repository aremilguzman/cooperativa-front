import '@testing-library/jest-dom'

import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder y TextDecoder para jsdom
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;