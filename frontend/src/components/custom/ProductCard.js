import { Button } from "@/components/ui/button";

const ProductCard = ({ product, category, onOpenModal }) => {
  const displayPrice = product.weight_prices?.length > 0
    ? `от ${Math.min(...product.weight_prices.map(wp => wp.price))}`
    : product.base_price;

  return (
    <div 
      className="product-card bg-white rounded-xl overflow-hidden border border-amber-100 hover:border-amber-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-amber-50">
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          loading="lazy"
        />
        {/* Category Badge */}
        {category && (
          <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-primary text-white text-[10px] md:text-xs font-semibold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md uppercase tracking-wider">
            {category.name}
          </span>
        )}
        {/* Decorative bee icon */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-5 h-5 md:w-6 md:h-6 bg-amber-400/80 rounded-full flex items-center justify-center">
          <span className="text-[10px] md:text-xs">🐝</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1 text-sm md:text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {product.name}
        </h3>
        
        <p className="text-primary font-bold text-base md:text-lg mb-2 md:mb-3">
          {displayPrice} ₸
        </p>

        <Button
          onClick={onOpenModal}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 md:py-2.5 rounded-lg btn-primary text-sm md:text-base"
          data-testid={`select-product-${product.id}`}
        >
          Выбрать
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
