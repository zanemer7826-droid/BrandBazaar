import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Clock,
  Star,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Product, CategoryFilter, SortOption } from '../../types/ecommerce';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  searchQuery: string;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onQuickView: (product: Product) => void;
  primaryColor: string;
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'featured', label: 'Featured & Top Picks', icon: Sparkles },
  { value: 'price-low', label: 'Price: Low to High', icon: ArrowUpNarrowWide },
  { value: 'price-high', label: 'Price: High to Low', icon: ArrowDownNarrowWide },
  { value: 'newest', label: 'Newest Arrivals', icon: Clock },
  { value: 'rating', label: 'Highest Customer Rating', icon: Star },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  primaryColor,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract unique brands for filter
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return ['ALL', ...list];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesBrand = selectedBrand === 'ALL' || p.brand === selectedBrand;
        return matchesCategory && matchesSearch && matchesBrand;
      })
      .sort((a, b) => {
        if (sortOption === 'price-low') return a.price - b.price;
        if (sortOption === 'price-high') return b.price - a.price;
        if (sortOption === 'rating') return b.rating - a.rating;
        if (sortOption === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, selectedBrand, sortOption]);

  const activeSortLabel = SORT_OPTIONS.find((s) => s.value === sortOption)?.label || 'Featured & Top Picks';
  const ActiveSortIcon = SORT_OPTIONS.find((s) => s.value === sortOption)?.icon || Sparkles;

  const handleResetAll = () => {
    onSelectCategory('All');
    setSelectedBrand('ALL');
    setSortOption('featured');
  };

  const isFiltered =
    selectedCategory !== 'All' ||
    selectedBrand !== 'ALL' ||
    sortOption !== 'featured' ||
    Boolean(searchQuery);

  return (
    <div id="products-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Category Header & Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {selectedCategory === 'All' ? 'Curated Catalog' : `${selectedCategory} Collection`}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredProducts.length} items
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : 'Handpicked authenticated luxury brands and high-grade essentials.'}
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Brand Selector */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === 'ALL' ? 'All Brands' : b}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Custom Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Sort:</span>
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <ActiveSortIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{activeSortLabel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isSortDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Dropdown Menu Popover */}
            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-30 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sort Products By
                </div>

                {SORT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = sortOption === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortOption(opt.value);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                          }`}
                        />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reset Filters if modified */}
          {isFiltered && (
            <button
              onClick={handleResetAll}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* PRODUCTS GRID (RESPONSIVE FULL WIDTH) */}
      <div>
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No products matched your filters
              </h3>
              <p className="text-xs text-slate-500">
                Try adjusting your search criteria, category filters or sorting options.
              </p>
            </div>
            <button
              onClick={handleResetAll}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-opacity hover:opacity-95"
              style={{ backgroundColor: primaryColor || '#4f46e5' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.has(product.id)}
                onQuickView={onQuickView}
                primaryColor={primaryColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
