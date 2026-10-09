import { getPageByHandle } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

const PAGE_HANDLE = 'bv-pl-oz-26';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByHandle(PAGE_HANDLE);

  if (!page) {
    return {
      title: 'bv.pl.oz.26 - ozwvld',
    };
  }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
  };
}

export default async function BvPlOz26Page() {
  const page = await getPageByHandle(PAGE_HANDLE);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#232220]">
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://cdn.shopify.com/videos/c/o/v/42c520b636b64558a48e596d5fc8257b.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative pt-32 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-white mb-12 text-center">
            {page.title}
          </h1>

          <div
            className="prose prose-invert prose-sm sm:prose-base max-w-none
              prose-headings:tracking-wider prose-headings:text-white
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-accent prose-a:no-underline hover:prose-a:text-hover
              prose-strong:text-white prose-strong:font-bold
              prose-ul:text-gray-300 prose-ol:text-gray-300
              bg-dark-gray/80 p-8 border border-gray-800"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </div>
      </div>
    </main>
  );
}
