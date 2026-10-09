import { getAllProducts } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import EmailSignup from '@/components/EmailSignup';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let error: Error | null = null;

  try {
    products = await getAllProducts();
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error = err instanceof Error ? err : new Error('Unknown error');
  }

  return (
    <main className="min-h-screen">
      {/* Video Background */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://cdn.shopify.com/videos/c/o/v/82b20aed46f747c989839ea264b64cf2.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-wider text-white mb-4">
              bv.pl.oz.26
            </h1>
            <p className="text-sm md:text-base text-gray-400 tracking-wide">
              observe / create / grow
            </p>
          </div>

          {/* Products Grid */}
          {error ? (
            <div className="text-center py-20">
              <div className="bg-dark-gray p-8 inline-block">
                <p className="text-accent text-sm tracking-wide mb-4">
                  Unable to load products
                </p>
                <p className="text-gray-400 text-xs">
                  Please ensure your Shopify credentials are configured in .env.local
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-dark-gray p-8 inline-block">
                <p className="text-white text-sm tracking-wide mb-4">
                  No products available yet
                </p>
                <p className="text-gray-400 text-xs">
                  Add products to your Shopify store to see them here
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 pb-20">
              {products.map((product) => (
                <div key={product.id} className="w-full sm:w-[350px] lg:w-[300px] xl:w-[280px] flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer id="signup" className="fixed bottom-0 left-0 right-0 bg-black/69 border-t border-gray-900 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="w-full sm:max-w-[732px] lg:max-w-[964px] xl:max-w-[904px] flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-xs text-gray-500 tracking-wide">
                © 2025 Ozwvld. All rights reserved.
              </p>
              <EmailSignup />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
