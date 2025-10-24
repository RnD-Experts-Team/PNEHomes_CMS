import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
  width = 40,
  height = 42,
  alt = 'App Logo',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return <img src="/logo.svg" width={width} height={height} alt={alt} {...props} />;
}
