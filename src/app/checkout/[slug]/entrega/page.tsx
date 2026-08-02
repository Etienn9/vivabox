import { boxes } from "@/data/boxes"
import { notFound } from "next/navigation"
import DeliveryStep from "@/app/checkout/components/DeliveryStep"
import CheckoutProgress from "../../CheckoutProgress"

export default async function CheckoutDeliveryPage({
  params,
}: {
  params: { slug: string }
}) {

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
  }

  return (
    <>
      <CheckoutProgress current="elegir" subStep={2} />

      <div className="max-w-[1100px] mx-auto px-4 py-6">
        <DeliveryStep box={checkoutBox} />
      </div>
    </>
  )
}
