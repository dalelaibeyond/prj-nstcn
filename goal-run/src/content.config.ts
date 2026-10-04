import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';

const text = z.string().min(1);
const identity = { id: text, isPlaceholder: z.boolean() };
const ordered = { ...identity, order: z.number().int().positive() };
const link = z.object({ label: text, href: text });
const caption = z.object({ title: text, description: text });
const media = z.object({ src: z.string().regex(/^\/(?!\/)/), alt: text, kind: z.enum(['image', 'video']), width: z.number().int().positive(), height: z.number().int().positive(), ownership: z.enum(['own', 'partner', 'client']), permissionConfirmed: z.literal(true) });
const copyBlock = z.object({ type: z.enum(['heading', 'paragraph', 'link', 'list', 'table']), text: text.optional(), level: z.number().int().min(2).max(3).optional(), href: text.optional(), primary: z.boolean().optional(), items: z.array(text).optional(), rows: z.array(z.array(text)).optional() });
const sku = z.object({ id: text, name: text, specifications: z.record(text, text) });
const model = z.object({ id: text, name: text, specifications: z.record(text, text), skus: z.array(sku) });
const fields = z.object({ key: z.enum(['name', 'company', 'phoneWhatsapp', 'email', 'message']), label: text, placeholder: text, type: z.enum(['text', 'tel', 'email', 'textarea']), autocomplete: text, maxLength: z.number().positive() });

export const collections = {
  pages: defineCollection({ loader: file('src/content/pages.json'), schema: z.object({ ...identity, path: text, title: text, description: text, seoTitle: text, seoDescription: text, source: text, blocks: z.array(copyBlock) }) }),
  site: defineCollection({ loader: file('src/content/site.json'), schema: z.object({
    ...identity, demo: media.nullable(), teamPhoto: media.nullable(), manufacturingPhoto: media.nullable(), clientLogos: z.array(media), legalName: text, brandName: text, domain: text, phone: text, email: z.email(), privacyEmail: z.email(), address: text, registrationNumber: text, establishedYear: text, linkedin: z.url().nullable(),
    whatsapp: z.object({ e164: z.string().regex(/^\d+$/), prefill: text }), navigation: z.array(link), ui: z.record(text, text), formFields: z.array(fields).length(5).refine(values => new Set(values.map(f => f.key)).size === 5, 'Five unique inquiry fields are required'),
    metrics: z.array(z.object({ label: text, value: text, isExample: z.boolean() })), capabilities: z.array(caption), architecture: z.array(text), teamCapabilities: z.array(text), milestones: z.array(z.object({ year: text, title: text })), faq: z.array(z.object({ question: text, answer: text })), legal: z.object({ privacy: z.array(z.object({ title: text, body: text })), terms: z.array(z.object({ title: text, body: text })) }),
  }) }),
  products: defineCollection({ loader: file('src/content/products.json'), schema: z.object({
    ...ordered, name: text, scenario: z.enum(['education', 'office', 'wearable']), path: text, overview: text, capabilities: z.array(text), useCases: z.array(text), customisationOptions: z.array(text), certifications: z.array(text), modelCapabilities: text, interaction: text, battery: text, moq: z.literal('On request'), leadTime: z.literal('On request'), datasheets: z.array(z.object({ label: text, href: text })), media: z.array(media), models: z.array(model),
  }) }),
  solutions: defineCollection({ loader: file('src/content/solutions.json'), schema: z.object({ ...ordered, title: text, path: text, product: text, description: text, considerations: z.array(text) }) }),
  certifications: defineCollection({ loader: file('src/content/certifications.json'), schema: z.object({ ...identity, name: text, market: text, status: z.enum(['obtained', 'in-progress', 'not-applicable', 'unknown']), holder: text }).refine(c => !(c.isPlaceholder && c.status === 'obtained'), 'Placeholder certification cannot be obtained') }),
  cases: defineCollection({ loader: file('src/content/cases.json'), schema: z.object({ ...ordered, isExample: z.boolean(), industry: text, title: text, path: text, clientProfile: text, challenge: text, solution: text, deploymentScope: text, results: z.array(text), certificationsProvided: z.array(text), quote: z.object({ text, author: text, permissionConfirmed: z.literal(true) }).nullable() }).refine(c => !c.isPlaceholder || c.isExample, 'Placeholder cases must be examples').refine(c => !c.isExample || c.quote === null, 'Example cases cannot have quotes') }),
  insights: defineCollection({ loader: file('src/content/insights.json'), schema: z.object({ ...ordered, title: text, category: text, path: text, description: text, outline: z.array(text), body: z.array(copyBlock) }) }),
};
