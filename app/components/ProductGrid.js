
'use client'

import { useState } from 'react'

export default function ProductGrid({ products }) {
  const [searchTerm, setSearchTerm] = useState('')
//   const [minPrice, setMinPrice] = useState('')
//   const [maxPrice, setMaxPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Food Products', 'Cleaning Products']

  // State to track which product is currently clicked and expanded in the modal
  const [selectedProduct, setSelectedProduct] = useState(null)

//   const filteredProducts = (products || []).filter((product) => {
//     const matchesSearch = product.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//     const matchesMin = minPrice === '' || product.price >= parseFloat(minPrice)
//     const matchesMax = maxPrice === '' || product.price <= parseFloat(maxPrice)
//     const matchesCategory =
//       selectedCategory === 'All' ||
//       product.category === selectedCategory

//     return matchesSearch && matchesMin && matchesMax && matchesCategory
//   })


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
      {/* Category Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-orange-100 dark:border-gray-700 hover:bg-orange-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search and price filter controls */}
      {/* <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-32 px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-32 px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div> */}
      
      {/* Search filter control */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>


      {/* Show filtered results or appropriate empty state */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            {products && products.length > 0
              ? 'No products match your filters.'
              : 'No products yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-orange-100 dark:border-gray-700"
            >
              <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                {/* Optional Badge showing the product's category */}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded">
                  {product.category || 'Uncategorized'}
                </span>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate mt-1">
                  {product.name}
                </h3>
                <p className="text-red-600 dark:text-orange-400 font-bold mt-1">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox Modal */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-orange-100 dark:border-gray-700 p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 z-10 bg-orange-100 dark:bg-gray-700 hover:bg-orange-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
            >
              &times;
            </button>

            {/* Large Image */}
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Information Section */}
            <div className="mt-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded">
                {selectedProduct.category || 'Uncategorized'}
              </span>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-2">
                {selectedProduct.name}
              </h2>
              <p className="text-xl font-extrabold text-red-600 dark:text-orange-400 mt-1">
                ${Number(selectedProduct.price).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
