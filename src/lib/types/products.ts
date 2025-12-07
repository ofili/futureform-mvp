export interface ProductStat {
  label: string;
  value: string;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductUseCase {
  title: string;
  description: string;
  benefits: string[];
}

export interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  color: 'amber' | 'blue' | 'green' | 'purple';
  icon: string;
  slug: string;
  href: string;
  shortDescription: string;
  longDescription: string;
  stats: ProductStat[];
  features: ProductFeature[];
  useCases: ProductUseCase[];
}