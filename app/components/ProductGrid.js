'use client'

import { useState } from 'react'

export default function ProductGrid({ products }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // Filter products by name AND price range - both must match
  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesMin = minPrice === '' || product.price >= parseFloat(minPrice)
    const matchesMax = maxPrice === '' || product.price <= parseFloat(maxPrice)
    return matchesSearch && matchesMin && matchesMax
  })

  return (
    <div>
      {/* Search and price filter controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
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
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
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
    </div>
  )
}