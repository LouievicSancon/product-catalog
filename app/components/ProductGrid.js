'use client'

import { useState } from 'react'

export default function ProductGrid({ products }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Alphabetically ordered custom category list (with "All" pinned strictly at the top)
  const categories = [
    'All',
    'Biscuit, Chocolates, and Candy Products',
    'Cleaning Supplies',
    'Drinks/Beverages',
    'Frozen Food, Chicken, and Meat Products',
    'Pantry Staples Products'
  ]

  // Filter products based on search query and selected category
  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' ||
      product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* Highly portable interactive CSS Keyframes loaded locally */}
      <style>{`
        @keyframes breathing-glow {
          0%, 100% {
            box-shadow: 0 0 6px rgba(249, 115, 22, 0.2), 0 0 10px rgba(249, 115, 22, 0.1);
            border-color: rgba(249, 115, 22, 0.3);
          }
          50% {
            box-shadow: 0 0 18px rgba(249, 115, 22, 0.6), 0 0 30px rgba(249, 115, 22, 0.35);
            border-color: rgba(249, 115, 22, 0.9);
          }
        }

        @keyframes star-fly {
          0% {
            transform: translate(-35px, -35px) scale(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0;
            transform: translate(-25px, -25px) scale(0.3) rotate(45deg);
          }
          35% {
            opacity: 1;
            transform: translate(-8px, -8px) scale(1) rotate(90deg);
          }
          50% {
            transform: translate(5px, 5px) scale(1.3) rotate(180deg);
            opacity: 1;
            filter: drop-shadow(0 0 8px rgba(251, 191, 36, 1)) drop-shadow(0 0 14px rgba(251, 191, 36, 0.7));
          }
          65% {
            transform: translate(22px, 22px) scale(0.7) rotate(270deg);
            opacity: 0.8;
          }
          80% {
            transform: translate(40px, 40px) scale(0) rotate(360deg);
            opacity: 0;
          }
          100% {
            transform: translate(40px, 40px) scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes shimmer-sweep {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>

      {/* Top Search Controls Bar containing Hamburger Trigger and Input Field */}
      <div className="mb-6 flex gap-3 items-center">
        {/* Elegant Animated Hamburger Toggle Button */}
        <button
          onClick={() => setIsPanelOpen(true)}
          className="relative p-3 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 border rounded-xl shadow-sm hover:bg-orange-50 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer [animation:breathing-glow_3s_infinite_ease-in-out]"
          aria-label="Open categories menu"
        >
          {/* Shimmer sweep effect overlay */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-orange-500/10 dark:via-orange-400/20 to-transparent -skew-x-12 [animation:shimmer-sweep_6s_infinite_ease-in-out_1.5s] pointer-events-none" />

          {/* Glowing Shooting Star flying into and across the button */}
          <div className="absolute pointer-events-none [animation:star-fly_7s_infinite_ease-in-out_1s]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-yellow-400 dark:text-yellow-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
            >
              <path d="M12 .587l3.668 7.431 8.067 1.35-5.833 5.688 1.382 8.067-7.284-3.83-7.285 3.83 1.382-8.067-5.833-5.688 8.067-1.35z" />
            </svg>
          </div>

          {/* Main Menu Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Unified Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-orange-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Active Filter Indicator Badge */}
      {selectedCategory !== 'All' && (
        <div className="mb-6 flex items-center gap-2 animate-fadeIn">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Active Filter:
          </span>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100/60 dark:bg-orange-950/40 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-orange-100 dark:border-orange-900/30">
            {selectedCategory}
            <button
              onClick={() => setSelectedCategory('All')}
              className="hover:text-red-600 dark:hover:text-red-400 font-extrabold text-sm ml-1 cursor-pointer transition-colors"
            >
              &times;
            </button>
          </span>
        </div>
      )}

      {/* Left Slide-out Category Drawer (Backdrop Overlay) */}
      <div
        onClick={() => setIsPanelOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Left Drawer Side-Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-72 sm:w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col border-r border-orange-100 dark:border-gray-700 ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Panel Header */}
        <div className="p-5 border-b border-orange-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
            Filter Categories
          </h3>
          <button
            onClick={() => setIsPanelOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-bold text-2xl transition-colors p-1 cursor-pointer"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        {/* Vertically Aligned, Sorted Category List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat)
                setIsPanelOpen(false) // Smoothly auto-closes menu drawer on category selection
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-md translate-x-1'
                  : 'bg-orange-50/40 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-orange-100/30 dark:border-gray-700/50 hover:bg-orange-50 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Products Grid Section (3-column layout on mobile, automatically scaling up on larger screens) */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            {products && products.length > 0
              ? 'No products match your filters.'
              : 'No products yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 overflow-hidden border border-orange-100 dark:border-gray-700 flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                />
              </div>
              <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-orange-50/10 dark:to-orange-950/5">
                <div>
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.5 rounded">
                    {product.category || 'Uncategorized'}
                  </span>
                  <h3 className="text-[11px] sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-base text-red-600 dark:text-orange-400 font-extrabold mt-2 border-t border-orange-100/40 dark:border-gray-700/50 pt-1">
                  ₱{Number(product.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal Backdrop & Container */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-orange-100 dark:border-gray-700 p-4"
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 z-10 bg-orange-100 dark:bg-gray-700 hover:bg-orange-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
            >
              &times;
            </button>
            <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-xl mb-4">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded">
                {selectedProduct.category || 'Uncategorized'}
              </span>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-2">
                {selectedProduct.name}
              </h2>
              <p className="text-red-600 dark:text-orange-400 font-extrabold text-xl mt-1">
                ₱{Number(selectedProduct.price).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}