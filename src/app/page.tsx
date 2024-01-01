import Link from 'next/link';

export default function Page() {
  return (

    <h1 className="text-3xl text-white text-center">
      <button className="bg-violet-600 hover:bg-violet-900">
        <Link href="/weaklyPrices">
          weaklyPrices
        </Link>
      </button>
    </h1>

  );
}