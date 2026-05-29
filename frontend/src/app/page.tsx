import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-white">
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Sweet Delights, <br />
            <span className="text-[#c73b0f]">Delivered Daily.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#87635a] max-w-xl mx-auto md:mx-0">
            Indulge in our carefully crafted desserts, baked fresh with premium ingredients. Experience the perfect balance of flavor and art in every bite.
          </p>
          <div className="pt-4">
            <Link 
              href="/menu" 
              className="inline-block bg-[#c73b0f] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#a6300a] transition-all transform hover:scale-105 shadow-lg"
            >
              Order Now 🍰
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Image 
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop" 
            alt="Delicious desserts" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-background py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="text-4xl mb-4">🥐</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Freshly Baked</h3>
            <p className="text-[#87635a]">Our pastries are baked fresh every single morning.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Fast Delivery</h3>
            <p className="text-[#87635a]">Get your favorite desserts delivered right to your door.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Premium Quality</h3>
            <p className="text-[#87635a]">We use only the finest ingredients for the best taste.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
