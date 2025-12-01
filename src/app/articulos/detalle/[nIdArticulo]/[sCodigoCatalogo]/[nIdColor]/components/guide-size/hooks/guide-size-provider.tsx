import React, { ReactNode } from 'react'
import { GuideSizeContext } from './guide-size.context'
import { useGuideSize } from './useGuideSize'
import { DetalleProducto } from '@/lib/interfaces/articulo';

type Props = {
  codeGuideSize: string;
  children?: ReactNode;
  product: DetalleProducto
}

export const GuideSizeProvider = ({ codeGuideSize, children, product }: Props) => {
  const { guideSize, loading, error, selectSize, sizeCombined } = useGuideSize({ codeGuideSize })
  return (
    <GuideSizeContext.Provider
      value={{
        guideSize,
        isLoading: loading,
        error,
        selectSize,
        sizeCombined,
        product
      }}
    >
      {children}
    </GuideSizeContext.Provider>
  )
}
