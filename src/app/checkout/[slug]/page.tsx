import { boxes } from "@/data/boxes"
import { notFound } from "next/navigation"
import ProductStep from "@/app/checkout/components/ProductStep"
import CheckoutProgress from "../CheckoutProgress"

export default async function CheckoutProductPage({
  params,
}: {
  params: { slug: string }
}) {

  // Next 16 fix
  const { slug } = await Promise.resolve(params)

  if (!slug) {
    return <div>ERROR: slug undefined</div>
  }

  const box = boxes.find((b) => b.slug === slug)

  if (!box) {
    notFound()
  }

  const checkoutBox = {
    slug: box.slug,
    name: box.name,
    price: box.price,
    image: box.image ?? "",
    experiences: box.experiences,
    validityMonths: box.validityMonths,
  }

  return (
    <>
      {/* Progress bar */}
      <CheckoutProgress current="elegir" subStep={1} />

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-4 py-6">
        <ProductStep box={checkoutBox} />
      </div>
    </>
  )
}