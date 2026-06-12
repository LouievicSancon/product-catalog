export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500 dark:text-gray-400">
          No products yet. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
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
  )
}