import { PRODUCTS } from '@/lib/constants/products';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = Object.values(PRODUCTS).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.shortDescription,
      color: product.color,
      href: product.href
    }));

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}