import clsx from "clsx";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function Image({ src, alt, className }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx("object-cover w-142 rounded-2xl", className)}
    />
  );
}
