import './globals.css'

export const metadata = {
  title: 'Product Catalog',
  description: 'Browse our product catalog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}