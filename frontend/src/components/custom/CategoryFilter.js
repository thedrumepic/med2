const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex justify-center">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* "All" button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`category-btn whitespace-nowrap px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
            selectedCategory === null
              ? "bg-primary text-white active shadow-md"
              : "bg-white text-foreground border border-border hover:border-primary"
          }`}
          data-testid="category-all"
        >
          Все
        </button>

        {/* Category buttons */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`category-btn whitespace-nowrap px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              selectedCategory === category.id
                ? "bg-primary text-white active shadow-md"
                : "bg-white text-foreground border border-border hover:border-primary"
            }`}
            data-testid={`category-${category.slug}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
