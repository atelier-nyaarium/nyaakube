import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// Used by connect-pg-simple
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Load test environment variables
process.env.SESSION_SECRET = "test";
