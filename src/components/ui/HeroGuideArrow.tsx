export default function HeroGuideArrow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[6px] md:left-[20px] bottom-[-17px] md:bottom-[-39px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/arrow-curve-white.svg"
        alt=""
        className="h-[100px] w-auto md:h-[108px]"
      />
    </div>
  )
}
