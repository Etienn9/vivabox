import { create } from "zustand"
import { persist } from "zustand/middleware"

type CheckoutBox = {
  slug: string
  name: string
  price: number
}

export type DeliveryType = "digital" | "physical"
export type DeliverySpeed = "standard" | "express" | "outside" | null

type Pricing = {
  subtotal: number
  delivery: number
  total: number
}

type CheckoutState = {
  // PRODUCT
  box: CheckoutBox | null
  quantity: number

  // BUYER
  buyerName: string
  buyerPhone: string
  buyerEmail: string

  // DELIVERY
  deliveryType: DeliveryType
  deliverySpeed: DeliverySpeed

  // BACKEND DATA (SOURCE OF TRUTH)
  pricing: Pricing | null
  pricingUpdatedAt: number | null
  isPricingLoading: boolean

  // SYSTEM
  codes: string[]
  ventaId: string | null

  // HYDRATION
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void

  // FUTURE
  multiBeneficiary: boolean

  // ACTIONS
  setBox: (box: CheckoutBox) => void
  setQuantity: (q: number) => void

  setBuyer: (data: {
    name: string
    phone: string
    email: string
  }) => void

  setDelivery: (data: {
    type: DeliveryType
    speed: DeliverySpeed
  }) => void

  setMultiBeneficiary: (value: boolean) => void

  setCodes: (codes: string[]) => void
  setVentaId: (id: string | null) => void

  setPricing: (pricing: Pricing | null) => void
  setPricingLoading: (val: boolean) => void

  isValidForPayment: () => boolean

  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      // ======================
      // INITIAL STATE
      // ======================

      box: null,
      quantity: 1,

      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",

      deliveryType: "digital",
      deliverySpeed: null,

      pricing: null,
      pricingUpdatedAt: null,
      isPricingLoading: false,

      codes: [],
      ventaId: null,

      hasHydrated: false,
      multiBeneficiary: false,

      // ======================
      // ACTIONS
      // ======================

      setBox: (box) =>
        set({
          box,
          pricing: null,
          pricingUpdatedAt: null,
        }),

      setQuantity: (q) =>
        set({
          quantity: q,
          pricing: null,
          pricingUpdatedAt: null,
        }),

      setBuyer: ({ name, phone, email }) =>
        set({
          buyerName: name,
          buyerPhone: phone,
          buyerEmail: email,
        }),

      setDelivery: ({ type, speed }) =>
        set({
          deliveryType: type,
          deliverySpeed: speed,
          pricing: null,
          pricingUpdatedAt: null,
        }),

      setMultiBeneficiary: (value) =>
        set({ multiBeneficiary: value }),

      setHasHydrated: (value) =>
        set({ hasHydrated: value }),

      setCodes: (codes) => set({ codes }),

      setVentaId: (ventaId) => set({ ventaId }),

      setPricing: (pricing) =>
        set({
          pricing,
          pricingUpdatedAt: pricing ? Date.now() : null,
        }),

      setPricingLoading: (val) =>
        set({ isPricingLoading: val }),

      // ======================
      // VALIDATION
      // ======================

      isValidForPayment: () => {
        const {
          box,
          buyerName,
          buyerPhone,
          buyerEmail,
          deliveryType,
          deliverySpeed,
          pricing,
        } = get()

        if (!box) return false
        if (!buyerName || !buyerPhone || !buyerEmail) return false

        if (deliveryType === "physical" && !deliverySpeed) return false

        // 🔥 IMPORTANT: pricing still required for payment step
        if (!pricing) return false

        return true
      },

      // ======================
      // RESET
      // ======================

      reset: () =>
        set({
          box: null,
          quantity: 1,
          buyerName: "",
          buyerPhone: "",
          buyerEmail: "",
          deliveryType: "digital",
          deliverySpeed: null,

          pricing: null,
          pricingUpdatedAt: null,
          isPricingLoading: false,

          codes: [],
          ventaId: null,

          hasHydrated: false,
          multiBeneficiary: false,
        }),
    }),
    {
      name: "checkout-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)