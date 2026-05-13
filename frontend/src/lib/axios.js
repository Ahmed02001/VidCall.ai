/**
 * @fileoverview Axios Configuration Module
 *
 * This module configures and exports a pre-configured Axios instance for making HTTP requests
 * to the VidCall.ai backend API. The instance is set up with:
 * - Base URL from environment variables (VITE_API_URL)
 * - Credentials support for authenticated requests (cookies, authorization headers)
 *
 * Usage:
 * ```javascript
 * import axiosInstance from '@/lib/axios';
 * const response = await axiosInstance.get('/sessions');
 * ```
 *
 * @module lib/axios
 */

import axios from "axios";

/**
 * Pre-configured Axios Instance
 *
 * Axios instance configured for the VidCall.ai frontend application.
 * Automatically includes credentials in all requests for authentication support.
 *
 * Configuration:
 * - baseURL: API endpoint from VITE_API_URL environment variable
 * - withCredentials: Enabled to send/receive cookies and auth headers
 *
 * @type {import('axios').AxiosInstance}
 * @constant
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5055",
  withCredentials: true,
});

export default axiosInstance;
