import { useEffect, useState } from "react";
import clsx from "clsx";
import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";

const DescriptionProduct = ({ detallesAdicionales }: Props) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [render, setRender] = useState(false);
  useEffect(() => {
    const excludeKeys = ['sGeneroMaster'];

    const newAttributes: Attribute[] = [];
    for (const key in detallesAdicionales) {
      if (!detallesAdicionales[key] || excludeKeys.includes(key)) continue;
      const cleanName = key.replace(/^[a-z]/, '').match(/[A-Z][a-z]+/)?.[0] || key;

      newAttributes.push({
        name: cleanName,
        value: detallesAdicionales[key],
      });
    }
    setAttributes(newAttributes);

    setRender(true);
  }, [detallesAdicionales]);

  const itemClasses = {

    title: 'font-bold text-primary_sokso',
    trigger: 'flex justify-between',
    indicator: 'text-medium',
    content: 'text-small px-2',

  };

  return (
    <>
      {render && (
        <div className="flex mb-4 px-4 w-full justify-center">
    
          <Accordion variant='shadow' itemClasses={itemClasses} className="border-2 border-primary_sokso w-[450px]">
            <AccordionItem key='1' aria-label='Descripción' title='Descripción'>
              {attributes.length > 0 &&
                attributes.map(({ name, value }, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'item flex items-center gap-8 px-2 py-2',
                      index % 2 === 0 ? 'bg-bg_gray' : ''
                    )}
                  >
                    <dt className='text-title w-1/3 text-sm font-semibold sm:w-1/4'>
                      {name}
                    </dt>
                    <dd className='text-sm lowercase first-letter:capitalize'>
                      {value}
                    </dd>
                  </div>
                ))}
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default DescriptionProduct;

type Props = {
  detallesAdicionales: { [key: string]: string };
};

type Attribute = {
  name: string;
  value: string;
};
