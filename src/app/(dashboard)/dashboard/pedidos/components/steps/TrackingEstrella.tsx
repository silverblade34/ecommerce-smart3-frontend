
'use client';
import { Spinner } from '@heroui/react';
import { CheckFat, Clock, ClockAfternoon, Package, Tag, Truck, X } from '@phosphor-icons/react';
import clsx from 'clsx';
import { usePedidos } from '@/hooks/usePedidos';

type Props = {
  numeroPedido: string;

};

type TrackingStep = {
  id: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'preparing' | 'invoiced' | 'shipped';
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
  date: string | null;
  isCurrent: boolean;
  isCompleted: boolean;
  isRejected?: boolean;
};

export const TrackingEstrella = ({ numeroPedido }: Props) => {

  const { pedido, loading, error } = usePedidos(numeroPedido);

  if (loading) return <div className='flex justify-center mt-4'><Spinner color='secondary' size='md' label='Cargando '></Spinner></div>;
  if (error) return <div>Error al cargar el tracking: {error}</div>;
  if (!pedido?.trackingNetSuite) return <div>No hay datos de tracking disponibles</div>;

  const { dFechaConfirmacion, dFechaRechazo, trackingNetSuite } = pedido;
  const {
    dFechaPreparandoPedido,
    dFechaFacturacion,
    dFechaDespachado
  } = trackingNetSuite;


  const currentStatus =
    dFechaDespachado ? 'shipped' :
      dFechaFacturacion ? 'invoiced' :
        dFechaPreparandoPedido ? 'preparing' :
          dFechaConfirmacion ? 'approved' :
            dFechaRechazo ? 'rejected' :
              'pending';

  const steps: TrackingStep[] = [
    {
      id: 1,
      name: 'Evaluando pedido',
      status: currentStatus === 'rejected' ? 'rejected' :
        currentStatus === 'approved' ? 'approved' : 'pending',
      icon: Clock,
      activeIcon: currentStatus === 'rejected' ? X :
        currentStatus === 'pending' ? ClockAfternoon : CheckFat,
      date: dFechaRechazo || dFechaConfirmacion,
      isCurrent: ['pending', 'rejected', 'approved'].includes(currentStatus),
      isCompleted: !!dFechaConfirmacion
    },
    {
      id: 2,
      name: 'Preparando Pedido',
      status: 'preparing',
      icon: Package,
      activeIcon: Package,
      date: dFechaPreparandoPedido,
      isCurrent: currentStatus === 'preparing',
      isCompleted: !!dFechaPreparandoPedido
    },
    {
      id: 3,
      name: 'Pedido Facturado',
      status: 'invoiced',
      icon: Tag,
      activeIcon: Tag,
      date: dFechaFacturacion,
      isCurrent: currentStatus === 'invoiced',
      isCompleted: !!dFechaFacturacion
    },
    {
      id: 4,
      name: 'Pedido Despachado',
      status: 'shipped',
      icon: Truck,
      activeIcon: Truck,
      date: dFechaDespachado,
      isCurrent: currentStatus === 'shipped',
      isCompleted: !!dFechaDespachado
    }
  ];

  return (
    <div className="my-5 bg-white rounded-lg">
      <div className="relative flex justify-between p-4">
        {steps.map((step, index) => {
          const isPending = step.status === 'pending';
          const isRejected = step.status === 'rejected';

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className="relative flex items-center justify-center w-full">

                {index < steps.length - 1 && (
                  <div
                    className={clsx(
                      "absolute h-[2px] w-full left-[50%] top-1/2 transform -translate-y-1/2",
                      step.isCompleted ? "bg-primary_sokso" : "bg-gray-200"
                    )}
                  />
                )}
                {/* <div
                  className={clsx(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",



                    step.isCurrent ?
                      isRejected ? "border-red bg-white text-red" :
                        isPending ? "border-yellow bg-white text-yellow" :
                          "border-primary_sokso bg-white text-primary_sokso" :

                     
                         step.isCompleted ?
                          isRejected ? "bg-red border-red text-white" :
                            "bg-primary_sokso border-primary_sokso text-white" :
                          "border-gray-200 bg-white text-gray-400"
                  )}
                > */}
                <div
                  className={clsx(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                    step.isCompleted ?
                      isRejected ? "bg-red border-red text-white" :
                        "bg-primary_sokso border-primary_sokso text-white" :

                      step.isCurrent ?
                        isRejected ? "border-red bg-white text-red" :
                          isPending ? "border-yellow bg-white text-yellow" :
                            "border-primary_sokso bg-white text-primary_sokso" :
                        "border-gray-200 bg-white text-gray-400"
                  )}
                >
                  {(step.isCompleted || step.isCurrent) ? (
                    <step.activeIcon className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
              </div>

              <span
                className={clsx(
                  "mt-2 text-xs text-center",
                  step.isCurrent ?
                    isRejected ? "text-red font-medium" :
                      isPending ? "text-yellow font-medium" :
                        "text-primary_sokso font-medium" :
                    step.isCompleted ? "text-gray-700" : "text-gray-400"
                )}
              >
                {step.name}
              </span>

              {step.isCurrent && step.id === 1 && isRejected && isPending && (
                <span className={clsx(
                  "mt-1 px-2 py-0.5 text-xs rounded-full",
                  isRejected ? "bg-red text-black" :
                    isPending ? "bg-yellow text-black" :
                      "bg-white text-white"
                )}>
                  {isRejected ? 'Rechazado' :
                    isPending ? 'Pendiente' : 'Confirmado'}
                </span>
              )}

              {(step.date) && (
                <span className="text-xs text-gray mt-1">
                  {new Date(step.date).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};