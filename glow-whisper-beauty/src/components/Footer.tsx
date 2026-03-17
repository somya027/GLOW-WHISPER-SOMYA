import { Link } from "react-router-dom";

const footerLinks = {
  Shop: [
    { label: "Skin Care", to: "/products?category=Skin Care" },
    { label: "Hair Care", to: "/products?category=Hair Care" },
    { label: "Face Cream", to: "/products?category=Face Cream" },
    { label: "Shampoo", to: "/products?category=Shampoo" },
  ],
  Account: [
    { label: "My Account", to: "/account" },
    { label: "Order History", to: "/orders" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "Cart", to: "/cart" },
  ],
  Company: [
    { label: "About Us", to: "#" },
    { label: "Contact", to: "#" },
    { label: "Privacy Policy", to: "#" },
    { label: "Terms of Service", to: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border/50 mt-20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-3">Aura</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Premium beauty & personal care crafted with love and the finest natural ingredients.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-body text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Aura Skincare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
