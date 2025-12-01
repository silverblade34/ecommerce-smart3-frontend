'use client';
import { HeroUIProvider } from "@heroui/react";
import { ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

const ProviderUI = ({ children }: Props) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};

export default ProviderUI;
