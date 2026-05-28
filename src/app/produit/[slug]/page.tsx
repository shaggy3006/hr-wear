import ProductClient from "./ProductClient";

export async function generateStaticParams() {
  return [];
}

export default function ProductPage() {
  return <ProductClient />;
}
