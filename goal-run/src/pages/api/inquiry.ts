import type { APIRoute } from 'astro';
import { createInquiryHandler } from '../../lib/inquiry.mjs';
export const prerender = false;
const handle = createInquiryHandler();
export const POST: APIRoute = ({ request, clientAddress }) => handle(request, clientAddress);
