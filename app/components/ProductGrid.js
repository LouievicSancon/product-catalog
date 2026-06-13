'use client'

import { useState } from 'react'

export default function ProductGrid({ products }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Alphabetically ordered custom category list
  const categories = [
    'All',
    'Biscuit, Chocolates, and Candy Products',
    'Cleaning Supplies',
    'Drinks/Beverages',
    'Frozen Food, Chicken, and Meat Products',
    'Pantry Staples Products'
  ]

  // Filter products cleanly using safe sequential if-statements (prevents ampersand double-escaping compiler errors)
  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    const matchesCategory =
      selectedCategory === 'All' ||
      product.category === selectedCategory

    if (!matchesSearch) return false
    if (!matchesCategory) return false
    return true
  })

  return (
    <div>
      {/* Highly portable interactive CSS Keyframes loaded locally */}
      <style>{`
        /* 1. Breathing Glow around the square head boundary */
        @keyframes breathing-glow {
          0%, 100% {
            box-shadow: 0 0 6px rgba(249, 115, 22, 0.15), 0 0 10px rgba(249, 115, 22, 0.08);
            border-color: rgba(249, 115, 22, 0.25);
          }
          50% {
            box-shadow: 0 0 16px rgba(249, 115, 22, 0.5), 0 0 26px rgba(249, 115, 22, 0.3);
            border-color: rgba(249, 115, 22, 0.8);
          }
        }

        /* 2. Glassmorphic background shimmer sweep */
        @keyframes shimmer-sweep {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }

        /* 3. Arm Waving rotation timeline (rotates around shoulder joint at x=90, y=55) */
        @keyframes wave-arm {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-35deg); }
        }

        /* 4. Soft eye-blinking timeline for Light Mode */
        @keyframes eye-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        /* 5. Staggered floating Zzz translations for Dark Mode */
        @keyframes float-zzz-1 {
          0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translate(14px, -24px) scale(1.1); opacity: 0; }
        }

        @keyframes float-zzz-2 {
          0% { transform: translate(1px, 2px) scale(0.5); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translate(24px, -32px) scale(1.2); opacity: 0; }
        }

        @keyframes float-zzz-3 {
          0% { transform: translate(-1px, 3px) scale(0.5); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translate(19px, -40px) scale(1.3); opacity: 0; }
        }

        /* 6. Floating CTA speech bubble translation */
        @keyframes float-bubble {
          0%, 100% { transform: translateY(-50%) translateY(0); }
          50% { transform: translateY(-50%) translateY(-4px); }
        }

        /* Base mascot visibility definitions */
        .light-mascot { display: block; }
        .dark-mascot { display: none; }
        .zzzs-container { display: none; }
        .click-me-bubble { display: block; }

        /* Shoulder arm waving anchor point configuration (locks to right border of the square face) */
        .right-arm-wave {
          transform-origin: 90px 55px;
          animation: wave-arm 1.2s ease-in-out infinite;
        }

        /* Blinking eye anchor configuration */
        .blinking-eyes {
          transform-origin: 50px 35px;
          animation: eye-blink 4.5s infinite ease-in-out;
        }

        /* Class-scoped Dark Mode overrides */
        .dark .light-mascot { display: none; }
        .dark .dark-mascot { display: block; }
        .dark .zzzs-container { display: block; }
        .dark .click-me-bubble { display: none; }

        .zzz-char {
          position: absolute;
          font-family: monospace;
          font-weight: 800;
          color: #FBBF24;
          opacity: 0;
          text-shadow: 0 0 5px rgba(251, 191, 36, 0.4);
        }

        .zzz-char:nth-child(1) {
          animation: float-zzz-1 3s infinite linear;
        }
        .zzz-char:nth-child(2) {
          animation: float-zzz-2 3s infinite linear 1s;
        }
        .zzz-char:nth-child(3) {
          animation: float-zzz-3 3s infinite linear 2s;
        }
      `}</style>

      {/* Top Search Controls Bar containing Hamburger Trigger and Input Field */}
      <div className="mb-6 flex gap-3 items-center relative">
        {/* Animated Custom Stick-Buddy Toggle Button (The whole square face is the button!) */}
        <button
          onClick={() => setIsPanelOpen(true)}
          className="relative w-16 h-16 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-gray-700 rounded-2xl shadow-sm hover:bg-orange-50/50 dark:hover:bg-gray-700/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer overflow-visible [animation:breathing-glow_3s_infinite_ease-in-out]"
          aria-label="Open categories menu"
        >
          {/* Shimmer sweep glass effect overlay */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-orange-500/10 dark:via-orange-400/20 to-transparent -skew-x-12 [animation:shimmer-sweep_6s_infinite_ease-in-out_2s]" />
          </div>

          {/* Staggered Floating sleeping Zzz container */}
          <div className="zzzs-container absolute top-1 right-2 pointer-events-none">
            <span className="zzz-char text-[10px]">z</span>
            <span className="zzz-char text-xs">z</span>
            <span className="zzz-char text-sm">Z</span>
          </div>

          {/* Stick-Buddy Face Features & Out-of-Bounds Arms (style="overflow: visible" is vital!) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-full h-full relative z-10"
            style={{ overflow: 'visible' }}
          >
            {/* Common Static Left Arm (Sticks out of the left border of the square face!) */}
            <line x1="10" y1="55" x2="-14" y2="68" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />

            {/* --- LIGHT MODE GROUP: Smiling, Blinking & Waving --- */}
            <g className="light-mascot">
              {/* Blinking eyes group inside the square */}
              <g className="blinking-eyes">
                <circle cx="34" cy="38" r="3.5" fill="currentColor" />
                <circle cx="66" cy="38" r="3.5" fill="currentColor" />
              </g>
              {/* Smiling Mouth inside the square */}
              <path d="M 34 54 Q 50 68 66 54" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              
              {/* Waving Right Arm (Sticks completely OUT of the right border of the square face!) */}
              <g className="right-arm-wave">
                <line x1="90" y1="55" x2="128" y2="34" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              </g>
            </g>

            {/* --- DARK MODE GROUP: Cozy, Sleeping --- */}
            <g className="dark-mascot">
              {/* Sleeping Eyes (Closed curve segments) */}
              <path d="M 28 36 Q 34 42 40 36" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 60 36 Q 66 42 72 36" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              {/* Cozy Rest mouth inside the square */}
              <circle cx="50" cy="56" r="4" stroke="currentColor" strokeWidth="3.5" fill="none" />
              
              {/* Relaxed Right Arm (Draped down resting outside the right border) */}
              <line x1="90" y1="55" x2="114" y2="76" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
            </g>
          </svg>

          {/* Interactive Bouncing "Click me" Speech Bubble overlay (Pushed further right to avoid the out-of-bounds waving arm!) */}
          <div className="click-me-bubble absolute left-full ml-14 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap pointer-events-none select-none [animation:float-bubble_2s_infinite_ease-in-out] z-20">
            Click me!
            {/* Tiny arrow pointing left toward the waving hand */}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2.5 h-2.5 bg-red-600 rotate-45 rounded-sm" />
          </div>
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