import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export default function StoryPhotoBand({ src, alt, objectPosition = "center" }: Props) {
  return (
    <div className="relative w-full h-[280px] md:h-[440px] overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        style={{ objectPosition }}
        className="object-cover"
      />
    </div>
  );
}
