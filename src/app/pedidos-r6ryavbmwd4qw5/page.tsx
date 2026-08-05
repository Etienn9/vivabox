import { redirect } from "next/navigation"
import { PAGE_PATH } from "./types"

export default function PedidosRootPage() {
  redirect(`${PAGE_PATH}/por-preparar`)
}
