import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Minus, Plus } from "@phosphor-icons/react";

const SkeletonFilters = () => {
    return (
        <div className="animate-pulse mt-4">
            {/* Skeleton para Categorías */}
            <Disclosure as="div" defaultOpen={true} className="filter-category border-b border-line pb-8">
                <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <span className="ml-6 flex items-center">
                            <Plus aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <Minus aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                    </DisclosureButton>
                </h3>
                <DisclosurePanel className="list-category mt-4 max-h-40 space-y-2 overflow-auto">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-4 w-6 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </DisclosurePanel>
            </Disclosure>

            {/* Skeleton para Marcas */}
            <Disclosure as="div" defaultOpen={false} className="filter-brand mt-8 border-b border-line pb-8">
                <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <span className="ml-6 flex items-center">
                            <Plus aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <Minus aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                    </DisclosureButton>
                </h3>
                <DisclosurePanel className="list-brand mt-4 max-h-40 space-y-2 overflow-auto">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-4 w-6 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </DisclosurePanel>
            </Disclosure>

            {/* Skeleton para Género */}
            <Disclosure as="div" defaultOpen={false} className="filter-gender mt-8 border-b border-line pb-8">
                <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <span className="ml-6 flex items-center">
                            <Plus aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <Minus aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                    </DisclosureButton>
                </h3>
                <DisclosurePanel className="list-gender mt-4 max-h-40 space-y-2 overflow-auto">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-4 w-6 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </DisclosurePanel>
            </Disclosure>

            {/* Skeleton para Tipos */}
            <Disclosure as="div" defaultOpen={false} className="filter-type mt-8 border-b border-line pb-8">
                <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        <span className="ml-6 flex items-center">
                            <Plus aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <Minus aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                    </DisclosureButton>
                </h3>
                <DisclosurePanel className="list-type mt-4 flex max-h-32 flex-wrap items-center gap-3 gap-y-4 overflow-auto">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-8 bg-gray-200 rounded-full"
                            style={{
                                width: `${60 + (index * 10)}px`,
                                animationDelay: `${index * 0.1}s`
                            }}
                        ></div>
                    ))}
                </DisclosurePanel>
            </Disclosure>

            {/* Skeleton para Colores */}
            <Disclosure as="div" defaultOpen={false} className="filter-color mt-8 border-b border-line pb-8">
                <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <span className="ml-6 flex items-center">
                            <Plus aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <Minus aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                    </DisclosureButton>
                </h3>
                <DisclosurePanel className="list-color mt-4 grid grid-cols-6 gap-3">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-8 w-8 bg-gray-200 rounded-full"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        ></div>
                    ))}
                </DisclosurePanel>
            </Disclosure>

            {/* Skeleton para Rango de Precios */}
            <Disclosure as="div" defaultOpen={false} className="filter-price mt-8 border-b border-line pb-8">
                <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <span className="ml-6 flex items-center">
                            <Plus aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <Minus aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                    </DisclosureButton>
                </h3>
                <DisclosurePanel className="list-price mt-4 space-y-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full"></div>
                    <div className="flex justify-between">
                        <div className="h-10 w-20 bg-gray-200 rounded"></div>
                        <div className="h-10 w-20 bg-gray-200 rounded"></div>
                    </div>
                </DisclosurePanel>
            </Disclosure>

            {/* Skeleton para Tallas */}
            <Disclosure as="div" defaultOpen={false} className="filter-size mt-8 border-b border-line pb-8">
                <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <div className="h-4 w-14 bg-gray-200 rounded"></div>
                        <span className="ml-6 flex items-center">
                            <Plus aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <Minus aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                    </DisclosureButton>
                </h3>
                <DisclosurePanel className="list-size mt-4 flex max-h-32 flex-wrap items-center gap-3 gap-y-4 overflow-auto">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-8 w-12 bg-gray-200 rounded-full"
                            style={{ animationDelay: `${index * 0.08}s` }}
                        ></div>
                    ))}
                </DisclosurePanel>
            </Disclosure>

            {/* Skeleton para Estilos */}
            <Disclosure as="div" defaultOpen={false} className="filter-style mt-8 border-b border-line pb-8">
                <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <span className="ml-6 flex items-center">
                            <Plus aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <Minus aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                    </DisclosureButton>
                </h3>
                <DisclosurePanel className="list-style mt-4 flex max-h-32 flex-wrap items-center gap-3 gap-y-4 overflow-auto">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-8 bg-gray-200 rounded-full"
                            style={{
                                width: `${70 + (index * 15)}px`,
                                animationDelay: `${index * 0.12}s`
                            }}
                        ></div>
                    ))}
                </DisclosurePanel>
            </Disclosure>

            {/* Skeleton para Catálogos */}
            <Disclosure as="div" defaultOpen={false} className="filter-catalog mt-8 border-b border-line pb-8">
                <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <span className="ml-6 flex items-center">
                            <Plus aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                            <Minus aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                    </DisclosureButton>
                </h3>
                <DisclosurePanel className="list-catalog mt-4 flex max-h-32 flex-wrap items-center gap-3 gap-y-4 overflow-auto">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-8 bg-gray-200 rounded-full"
                            style={{
                                width: `${80 + (index * 20)}px`,
                                animationDelay: `${index * 0.15}s`
                            }}
                        ></div>
                    ))}
                </DisclosurePanel>
            </Disclosure>
        </div>
    );
};

export default SkeletonFilters;