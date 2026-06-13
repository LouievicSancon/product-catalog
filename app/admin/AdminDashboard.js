'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboard({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Biscuit, Chocolates, and Candy Products')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function openAddForm() {
    setEditingProduct(null)
    setName('')
    setPrice('')
    setCategory('Biscuit, Chocolates, and Candy Products')
    setImage(null)
    setShowForm(true)
  }

  function openEditForm(product) {
    setEditingProduct(product)
    setName(product.name)
    setPrice(product.price.toString())
    setCategory(product.category || 'Biscuit, Chocolates, and Candy Products')
    setImage(null)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    let imageUrl = editingProduct?.image_url || ''

    if (image) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image)

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      imageUrl = urlData.publicUrl
    }

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update({ name, price: parseFloat(price), category, image_url: imageUrl })
        .eq('id', editingProduct.id)

      if (error) {
        alert('Error updating product: ' + error.message)
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert({ name, price: parseFloat(price), category, image_url: imageUrl })

      if (error) {
        alert('Error adding product: ' + error.message)
        setLoading(false)
        return
      }
    }

    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(product) {
    if (!confirm('Are you sure you want to delete this product?')) return

    const fileName = product.image_url.split('/').pop()
    await supabase.storage.from('product-images').remove([fileName])

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (error) {
      alert('Error deleting product: ' + error.message)
      return
    }

    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-white text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Products ({products.length})</h2>
          <button
            onClick={openAddForm}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-lg hover:from-red-700 hover:to-orange-600 transition-all cursor-pointer"
          >
            + Add Product
          </button>
        </div>

        {/* Floating Modal Form Overlay */}
        {showForm && (
          <div
            onClick={() => setShowForm(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-orange-100 dark:border-gray-700 p-6 my-8 transform transition-all duration-300 animate-fadeIn"
            >
              {/* Elegant Close Icon Button in top corner */}
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 z-10 bg-orange-50 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                aria-label="Close form"
              >
                &times;
              </button>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b border-orange-100 dark:border-gray-700 pb-3">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="Biscuit, Chocolates, and Candy Products">Biscuit, Chocolates, and Candy Products</option>
                    <option value="Pantry Staples Products">Pantry Staples Products</option>
                    <option value="Cleaning Supplies">Cleaning Supplies</option>
                    <option value="Drinks/Beverages">Drinks/Beverages</option>
                    <option value="Frozen Food, Chicken, and Meat Products">Frozen Food, Chicken, and Meat Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Price (₱)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Product Image {editingProduct && '(leave empty to keep current)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required={!editingProduct}
                    className="w-full px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-pointer"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-orange-100 dark:border-gray-700 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-600 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-orange-100 dark:border-gray-700 transition-shadow duration-300 hover:shadow-lg">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded">
                {product.category || 'Uncategorized'}
              </span>
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mt-1 truncate">{product.name}</h3>
              <p className="text-red-600 dark:text-orange-400 font-bold">₱{Number(product.price).toFixed(2)}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEditForm(product)}
                  className="flex-1 px-3 py-1 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors text-sm font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="flex-1 px-3 py-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm font-semibold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500 py-10">No products yet. Click "Add Product" to get started!</p>
        )}
      </main>
    </div>
  )
}