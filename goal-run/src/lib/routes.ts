import type { Content } from './content';
export const fixedRoutes = ['products', 'compare', 'solutions', 'custom', 'case-studies', 'about', 'insights', 'contact', 'faq', 'compliance', 'privacy', 'terms'] as const;
export function routes(c: Content) {
  return [
    ...fixedRoutes.map(path => ({ path, kind: path, id: undefined as string | undefined })),
    ...c.products.map(p => ({ path: p.path.replace(/^\/+|\/+$/g, ''), kind: 'product', id: p.id })),
    ...c.solutions.map(p => ({ path: p.path.replace(/^\/+|\/+$/g, ''), kind: 'solution', id: p.id })),
    ...c.cases.map(p => ({ path: p.path.replace(/^\/+|\/+$/g, ''), kind: 'case', id: p.id })),
    ...c.insights.map(p => ({ path: p.path.replace(/^\/+|\/+$/g, ''), kind: 'insight', id: p.id })),
  ];
}
