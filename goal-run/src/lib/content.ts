import { getCollection, getEntry } from 'astro:content';

export async function loadContent() {
  const site = (await getEntry('site', 'main'))!.data;
  if (!site) throw new Error('Site content is required');
  const [products, solutions, cases, certifications, insights] = await Promise.all([
    getCollection('products'), getCollection('solutions'), getCollection('cases'), getCollection('certifications'), getCollection('insights'),
  ]);
  const sort = <T extends { order: number }>(entries: { data: T }[]): T[] => entries.map(e => e.data).sort((a, b) => a.order - b.order);
  const data = { site, products: sort(products), solutions: sort(solutions), cases: sort(cases), certifications: certifications.map(e => e.data), insights: sort(insights) };
  for (const product of data.products) for (const id of product.certifications) {
    if (!data.certifications.some(c => c.id === id)) throw new Error(`Unknown certification ${id}`);
  }
  for (const solution of data.solutions) if (!data.products.some(p => p.id === solution.product)) throw new Error(`Unknown product ${solution.product}`);
  const t = (key: string) => {
    if (!site.ui[key]) throw new Error(`Missing UI content: ${key}`);
    return site.ui[key];
  };
  return { ...data, t };
}

export type Content = Awaited<ReturnType<typeof loadContent>>;
