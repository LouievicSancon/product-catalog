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

  // --- Batch State Management ---
  const [selectedIds, setSelectedIds] = useState([])
  const [showBulkAddForm, setShowBulkAddForm] = useState(false)
  const [bulkAddRows, setBulkAddRows] = useState([
    { name: '', price: '', category: 'Biscuit, Chocolates, and Candy Products', image: null }
  ])
  const [showBulkEditForm, setShowBulkEditForm] = useState(false)
  const [bulkEditCategory, setBulkEditCategory] = useState('No Change')
  const [bulkEditPrice, setBulkEditPrice] = useState('')

  // List of your custom categories
  const categories = [
    'Biscuit, Chocolates, and Candy Products',
    'Pantry Staples Products',
    'Cleaning Supplies',
    'Drinks/Beverages',
    'Frozen Food, Chicken, and Meat Products'
  ]

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

  // --- Toggle Selection helper ---
  function handleToggleSelect(productId) {
    if (selectedIds.includes(productId)) {
      setSelectedIds(selectedIds.filter(id => id !== productId))
    } else {
      setSelectedIds([...selectedIds, productId])
    }
  }

  function handleSelectAll() {
    if (selectedIds.length === products.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(products.map(p => p.id))
    }
  }

  // --- Single Submit (Create / Update) ---
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

  // --- Single Delete ---
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

  // --- Batch Delete ---
  async function handleBatchDelete() {
    if (selectedIds.length === 0) return
    const count = selectedIds.length
    if (!confirm(`Are you absolutely sure you want to delete all ${count} selected products? This action cannot be undone.`)) return

    setLoading(true)

    try {
      // 1. Fetch images to clean up storage
      const { data: itemsToDelete } = await supabase
        .from('products')
        .select('image_url')
        .in('id', selectedIds)

      if (itemsToDelete && itemsToDelete.length > 0) {
        const fileNames = itemsToDelete
          .map(p => p.image_url?.split('/').pop())
          .filter(Boolean)

        if (fileNames.length > 0) {
          await supabase.storage.from('product-images').remove(fileNames)
        }
      }

      // 2. Perform bulk deletion from database
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedIds)

      if (error) throw error

      setSelectedIds([])
      router.refresh()
    } catch (err) {
      alert('Batch delete failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- Batch Update ---
  async function handleBatchUpdate(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {}
      if (bulkEditCategory !== 'No Change') {
        updateData.category = bulkEditCategory
      }
      if (bulkEditPrice !== '') {
        updateData.price = parseFloat(bulkEditPrice)
      }

      if (Object.keys(updateData).length === 0) {
        alert('Please choose a field value to update!')
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .in('id', selectedIds)

      if (error) throw error

      setShowBulkEditForm(false)
      setSelectedIds([])
      router.refresh()
    } catch (err) {
      alert('Batch update failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- Batch Add dynamic rows ---
  function addBulkAddRow() {
    setBulkAddRows([...bulkAddRows, { name: '', price: '', category: 'Biscuit, Chocolates, and Candy Products', image: null }])
  }

  function removeBulkAddRow(index) {
    if (bulkAddRows.length === 1) return
    setBulkAddRows(bulkAddRows.filter((_, i) => i !== index))
  }

  function updateBulkAddRow(index, key, value) {
    const updated = [...bulkAddRows]
    updated[index][key] = value
    setBulkAddRows(updated)
  }

  // --- Batch Add Submit ---
  async function handleBatchAddSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const inserts = []

      for (const row of bulkAddRows) {
        let imageUrl = ''

        if (row.image) {
          const fileExt = row.image.name.split('.').pop()
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, row.image)

          if (uploadError) throw uploadError

          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

          imageUrl = urlData.publicUrl
        }

        inserts.push({
          name: row.name,
          price: parseFloat(row.price),
          category: row.category,
          image_url: imageUrl
        })
      }

      const { error } = await supabase.from('products').insert(inserts)
      if (error) throw error

      setShowBulkAddForm(false)
      setBulkAddRows([{ name: '', price: '', category: 'Biscuit, Chocolates, and Candy Products', image: null }])
      router.refresh()
    } catch (err) {
      alert('Bulk add insert failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-24">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Products ({products.length})</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedIds.length} of {products.length} products selected
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                setBulkAddRows([{ name: '', price: '', category: 'Biscuit, Chocolates, and Candy Products', image: null }])
                setShowBulkAddForm(true)
              }}
              className="px-5 py-2.5 bg-orange-100 text-orange-800 font-semibold rounded-lg hover:bg-orange-200 transition-all cursor-pointer text-sm shadow-sm"
            >
              Bulk Add Products
            </button>
            <button
              onClick={openAddForm}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-lg hover:from-red-700 hover:to-orange-600 transition-all cursor-pointer text-sm shadow-md"
            >
              + Single Product
            </button>
          </div>
        </div>

        {/* Master Select Control Checkbox */}
        <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer select-none text-sm font-semibold text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={products.length > 0 && selectedIds.length === products.length}
              onChange={handleSelectAll}
              className="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            Select All Products ({products.length})
          </label>
        </div>

        {/* --- Single Product Add/Edit Floating Modal Form --- */}
        {showForm && (
          <div
            onClick={() => setShowForm(false)}
            className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-orange-100 dark:border-gray-700 p-6 my-8 transform transition-all duration-300 animate-fadeIn"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 z-10 bg-orange-50 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b border-orange-100 dark:border-gray-700 pb-3">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Price (₱)</label>
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

        {/* --- BATCH ADD PRODUCTS FLOATING MODAL --- */}
        {showBulkAddForm && (
          <div
            onClick={() => setShowBulkAddForm(false)}
            className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-orange-100 dark:border-gray-700 p-6 my-8 transform transition-all duration-300 max-h-[85vh] flex flex-col"
            >
              <button
                onClick={() => setShowBulkAddForm(false)}
                className="absolute top-4 right-4 z-10 bg-orange-50 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-orange-100 dark:border-gray-700 pb-3">
                Bulk Add Products
              </h3>

              <form onSubmit={handleBatchAddSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                  {bulkAddRows.map((row, index) => (
                    <div key={index} className="p-4 border border-orange-100 dark:border-gray-700 rounded-xl bg-orange-50/20 dark:bg-gray-900/30 relative flex flex-col md:flex-row gap-3 items-end">
                      <button
                        type="button"
                        onClick={() => removeBulkAddRow(index)}
                        disabled={bulkAddRows.length === 1}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold disabled:opacity-30 cursor-pointer"
                        title="Remove row"
                      >
                        &times;
                      </button>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Product Name</label>
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateBulkAddRow(index, 'name', e.target.value)}
                          required
                          className="w-full px-3 py-1.5 border border-orange-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="w-full md:w-56">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</label>
                        <select
                          value={row.category}
                          onChange={(e) => updateBulkAddRow(index, 'category', e.target.value)}
                          required
                          className="w-full px-3 py-1.5 border border-orange-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-pointer"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Price (₱)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={row.price}
                          onChange={(e) => updateBulkAddRow(index, 'price', e.target.value)}
                          required
                          className="w-full px-3 py-1.5 border border-orange-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="w-full md:w-56">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updateBulkAddRow(index, 'image', e.target.files[0])}
                          required
                          className="w-full px-2 py-1 border border-orange-200 dark:border-gray-600 rounded-lg text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBulkAddRow}
                    className="w-full py-2.5 border-2 border-dashed border-orange-300 dark:border-gray-600 text-orange-600 dark:text-orange-400 font-bold rounded-xl hover:bg-orange-50/50 dark:hover:bg-gray-900/40 transition-colors cursor-pointer text-sm"
                  >
                    + Add Another Product Row
                  </button>
                </div>

                <div className="flex gap-3 pt-4 border-t border-orange-100 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-600 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {loading ? 'Saving Batch...' : `Save All ${bulkAddRows.length} Products`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBulkAddForm(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- BATCH UPDATE PRODUCTS FLOATING MODAL --- */}
        {showBulkEditForm && (
          <div
            onClick={() => setShowBulkEditForm(false)}
            className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-orange-100 dark:border-gray-700 p-6 my-8 transform transition-all duration-300"
            >
              <button
                onClick={() => setShowBulkEditForm(false)}
                className="absolute top-4 right-4 z-10 bg-orange-50 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 border-b border-orange-100 dark:border-gray-700 pb-3">
                Batch Update {selectedIds.length} Products
              </h3>
              <form onSubmit={handleBatchUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Bulk Category Update
                  </label>
                  <select
                    value={bulkEditCategory}
                    onChange={(e) => setBulkEditCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="No Change">— Do Not Modify Category —</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Bulk Price Update (₱)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Leave empty to keep original prices"
                    value={bulkEditPrice}
                    onChange={(e) => setBulkEditPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-orange-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-orange-100 dark:border-gray-700 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-600 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {loading ? 'Updating...' : 'Apply Bulk Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBulkEditForm(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- PRODUCT CARDS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id)
            return (
              <div
                key={product.id}
                onClick={() => handleToggleSelect(product.id)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border transition-all duration-300 relative flex flex-col cursor-pointer hover:shadow-lg select-none ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20 translate-y-[-2px]'
                    : 'border-orange-100 dark:border-gray-700'
                }`}
              >
                {/* Product Selection Checkbox overlay */}
                <div
                  className="absolute top-3 left-3 z-10 bg-white dark:bg-gray-800 rounded p-1 shadow-md border border-orange-100 dark:border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(product.id)}
                    className="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                </div>

                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3 pointer-events-none"
                />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded self-start">
                  {product.category || 'Uncategorized'}
                </span>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mt-2 truncate">{product.name}</h3>
                <p className="text-red-600 dark:text-orange-400 font-bold">₱{Number(product.price).toFixed(2)}</p>

                {/* Individual Actions Bar (stops propagation to prevent click select-toggling) */}
                <div
                  className="flex gap-2 mt-4 pt-3 border-t border-orange-50/50 dark:border-gray-700/50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEditForm(product)}
                    className="flex-1 px-3 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-sm font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="flex-1 px-3 py-1 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-semibold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500 py-10">No products yet. Click "Add Product" to get started!</p>
        )}
      </main>

      {/* --- FLOATING BATCH ACTIONS BAR (Renders only when 1 or more products are checked) --- */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-orange-950 text-white rounded-2xl shadow-2xl border border-orange-500/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slideUp backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="bg-orange-500 text-white font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center shadow-md">
              {selectedIds.length}
            </span>
            <span className="text-sm font-medium tracking-wide">Products Selected</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                setBulkEditCategory('No Change')
                setBulkEditPrice('')
                setShowBulkEditForm(true)
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all cursor-pointer text-xs shadow-md"
            >
              Update Selected
            </button>
            <button
              onClick={handleBatchDelete}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer text-xs shadow-md disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete Selected'}
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold rounded-xl transition-colors cursor-pointer text-xs">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}