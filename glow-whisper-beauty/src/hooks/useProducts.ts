import { useQuery } from "@tanstack/react-query";
import {
  productsApi,
  categoriesApi,
  type ProductDTO,
  type PaginatedProducts,
  resolveImageUrl,
} from "@/lib/api";
import type { Product } from "@/data/products";

/* ── map backend DTO → frontend Product interface ── */
export function toProduct(dto: ProductDTO): Product {
  return {
    id: String(dto.id),
    name: dto.name,
    price: dto.price,
    originalPrice: dto.originalPrice ?? undefined,
    rating: dto.rating,
    reviews: dto.reviews,
    image: resolveImageUrl(dto.image),
    category: dto.category,
    description: dto.description,
    benefits: dto.benefits ?? [],
    ingredients: dto.ingredients ?? [],
    badge: dto.badge ?? undefined,
  };
}

/* ── hooks ── */

export function useProducts(params?: Record<string, string>) {
  return useQuery<{ products: Product[]; totalPages: number; totalItems: number }>({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await productsApi.list(params);
      const data = res.data as PaginatedProducts;
      return {
        products: data.items.map(toProduct),
        totalPages: data.total_pages,
        totalItems: data.total_items,
      };
    },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery<Product | null>({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const res = await productsApi.get(id);
      return toProduct(res.data);
    },
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await productsApi.featured();
      return (res.data as ProductDTO[]).map(toProduct);
    },
  });
}

export function useTrendingProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "trending"],
    queryFn: async () => {
      const res = await productsApi.trending();
      return (res.data as ProductDTO[]).map(toProduct);
    },
  });
}

export function useCategories() {
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoriesApi.list();
      return (res.data as { id: number; name: string }[]).map((c) => c.name);
    },
  });
}
