import { createClient } from '@/lib/supabase/server'
import ThemeToggle from './components/ThemeToggle'
import ProductGrid from './components/ProductGrid'

export default async function Home() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select()
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 dark:from-red-800 dark:via-orange-700 dark:to-yellow-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ProductGrid products={products} />
      </main>
    </div>
  )
}