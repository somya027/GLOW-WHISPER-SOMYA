import productShampoo from "@/assets/product-shampoo.jpg";
import productFacecream from "@/assets/product-facecream.jpg";
import productHaircare from "@/assets/product-haircare.jpg";
import productSkincare from "@/assets/product-skincare.jpg";
import productBodylotion from "@/assets/product-bodylotion.jpg";
import productLipcare from "@/assets/product-lipcare.jpg";
import productEyecream from "@/assets/product-eyecream.jpg";
import productSunscreen from "@/assets/product-sunscreen.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  badge?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Rose Petal Hydrating Shampoo",
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 234,
    image: productShampoo,
    category: "Shampoo",
    description: "A luxurious hydrating shampoo infused with real rose petals and argan oil. Gently cleanses while restoring moisture and shine to your hair.",
    benefits: ["Deep hydration", "Adds natural shine", "Strengthens hair", "Pleasant rose fragrance"],
    ingredients: ["Rosa Damascena Flower Water", "Argan Oil", "Keratin", "Vitamin E", "Aloe Vera"],
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Radiance Renewal Face Cream",
    price: 1299,
    rating: 4.9,
    reviews: 412,
    image: productFacecream,
    category: "Face Cream",
    description: "An ultra-rich face cream that deeply nourishes and revitalizes your skin. Formulated with hyaluronic acid and retinol for a youthful, radiant glow.",
    benefits: ["Anti-aging", "Deep moisturizing", "Reduces fine lines", "Brightens complexion"],
    ingredients: ["Hyaluronic Acid", "Retinol", "Vitamin C", "Shea Butter", "Niacinamide"],
    badge: "New",
  },
  {
    id: "3",
    name: "Silk Repair Hair Serum",
    price: 899,
    rating: 4.7,
    reviews: 189,
    image: productHaircare,
    category: "Hair Care",
    description: "A lightweight yet powerful hair serum that repairs damaged hair from root to tip. Infused with silk proteins and lavender essential oil.",
    benefits: ["Repairs split ends", "Reduces frizz", "Heat protection", "Adds silky texture"],
    ingredients: ["Silk Proteins", "Lavender Oil", "Argan Oil", "Biotin", "Jojoba Oil"],
  },
  {
    id: "4",
    name: "Golden Glow Facial Serum",
    price: 1499,
    originalPrice: 1899,
    rating: 4.9,
    reviews: 567,
    image: productSkincare,
    category: "Skin Care",
    description: "A premium facial serum with 24K gold particles and vitamin C. Delivers intense hydration and a luminous, dewy finish.",
    benefits: ["Intense hydration", "Luminous glow", "Firms skin", "Reduces dark spots"],
    ingredients: ["24K Gold", "Vitamin C", "Squalane", "Rosehip Oil", "Peptides"],
    badge: "Top Rated",
  },
  {
    id: "5",
    name: "Velvet Body Lotion",
    price: 699,
    rating: 4.6,
    reviews: 156,
    image: productBodylotion,
    category: "Skin Care",
    description: "A velvety smooth body lotion that melts into your skin, providing 24-hour hydration with a subtle floral scent.",
    benefits: ["24hr hydration", "Non-greasy", "Softens skin", "Subtle fragrance"],
    ingredients: ["Shea Butter", "Coconut Oil", "Vitamin E", "Chamomile Extract", "Glycerin"],
  },
  {
    id: "6",
    name: "Cherry Blossom Lip Balm",
    price: 349,
    rating: 4.5,
    reviews: 298,
    image: productLipcare,
    category: "Skin Care",
    description: "A nourishing lip balm infused with cherry blossom extract. Keeps lips soft, plump, and beautifully hydrated all day.",
    benefits: ["Moisturizes lips", "Natural tint", "SPF protection", "Long-lasting"],
    ingredients: ["Cherry Blossom Extract", "Beeswax", "Vitamin E", "Jojoba Oil", "Rosehip Oil"],
  },
  {
    id: "7",
    name: "Lavender Eye Revive Cream",
    price: 1099,
    rating: 4.8,
    reviews: 203,
    image: productEyecream,
    category: "Face Cream",
    description: "A delicate eye cream specifically formulated to reduce puffiness, dark circles, and fine lines around the eye area.",
    benefits: ["Reduces dark circles", "Minimizes puffiness", "Smooths fine lines", "Brightens under-eye"],
    ingredients: ["Lavender Extract", "Caffeine", "Peptides", "Hyaluronic Acid", "Cucumber Extract"],
  },
  {
    id: "8",
    name: "Botanical Sun Shield SPF 50",
    price: 999,
    rating: 4.7,
    reviews: 178,
    image: productSunscreen,
    category: "Skin Care",
    description: "A lightweight, non-greasy sunscreen with broad-spectrum SPF 50 protection. Enriched with botanical extracts for added skin benefits.",
    benefits: ["SPF 50 protection", "Non-greasy", "Moisturizing", "No white cast"],
    ingredients: ["Zinc Oxide", "Green Tea Extract", "Aloe Vera", "Vitamin E", "Chamomile"],
    badge: "Essential",
  },
];

export const categories = ["Shampoo", "Face Cream", "Hair Care", "Skin Care"];

export const testimonials = [
  {
    id: 1,
    name: "Priya S.",
    text: "The Golden Glow Serum has completely transformed my skin! I've never felt so confident without makeup.",
    rating: 5,
    product: "Golden Glow Facial Serum",
  },
  {
    id: 2,
    name: "Ananya R.",
    text: "I've tried countless shampoos, and the Rose Petal one is by far the best. My hair has never been so soft and shiny!",
    rating: 5,
    product: "Rose Petal Hydrating Shampoo",
  },
  {
    id: 3,
    name: "Meera K.",
    text: "The Eye Revive Cream is magical. After just two weeks, my dark circles are significantly lighter.",
    rating: 5,
    product: "Lavender Eye Revive Cream",
  },
];
