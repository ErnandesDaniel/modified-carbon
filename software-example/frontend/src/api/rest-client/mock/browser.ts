'use client';

import { setupWorker } from 'msw/browser';

import { getOpenAPIDefinitionMock } from '@/api/rest-client';
export const worker = setupWorker(...getOpenAPIDefinitionMock());
