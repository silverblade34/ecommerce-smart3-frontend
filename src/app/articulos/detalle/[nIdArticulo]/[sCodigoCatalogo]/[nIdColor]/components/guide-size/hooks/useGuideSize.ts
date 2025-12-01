import { useEffect, useMemo, useState } from "react";
import {
  ResponseGuideSize,
  SizeGuideEcommerceResponse,
  SizeMessage
} from "../interfaces/responseGuideSize";

type Props = {
  codeGuideSize: string;
};

export const useGuideSize = ({ codeGuideSize }: Props) => {
  const [guideSize, setGuideSize] = useState<SizeGuideEcommerceResponse | null>(null);
  const [sizeCombined, setSizeCombined] = useState<SizeMessage | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gsConfigName = useMemo(() => {
    return { 
      genderName: guideSize?.sizeMessages.gender,
      size_system: guideSize?.sizeMessages.size_system
    }
  },[guideSize])

  const fetchGuideSize = async () => {
    setLoading(true);
    setError(null);
    try {

      if(codeGuideSize === 'NA') {
        setLoading(false)
        setError(null)
        setGuideSize(null)
        return
      }
      // TODO: Cambiar la URL por la correcta cuando esté disponible
      const API_URL = process.env.NEXT_PUBLIC_API_GUIDE_SIZE_URL || 'https://api-qas-guia-tallas.sokso.com';
      const response = await fetch(`${API_URL}/public-api/eccomerce/guide-size/${codeGuideSize}/1`);
      if (!response.ok) {
        throw new Error("Error fetching guide size data");
      }
      const data = (await response.json()) as ResponseGuideSize;
      setGuideSize(data.matrix);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codeGuideSize) {
      fetchGuideSize();
    }
  }, [codeGuideSize]);

  const selectSize = (value: string) => {
    setSizeCombined(null)
    if (!guideSize?.sizeMessages) return;
    const { sizes_combined } = guideSize.sizeMessages
    const combinedSel = sizes_combined.find(e => e.size_value === value)
    setSizeCombined(combinedSel)
  };

  return { guideSize, loading, error, selectSize, sizeCombined, gsConfigName };
};
