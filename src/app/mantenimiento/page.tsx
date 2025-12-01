export default function MaintenancePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 max-w-md w-full text-center animate-fadeIn space-y-6">
        <h2 className="text-xl sm:text-xl font-semibold text-gray-800">
          Estamos realizando mejoras
        </h2>
        <p className="mt-4 text-gray-800 md:text-base">
          {/* 🕒 Smart Sokso estará en pausa por mantenimiento a partir de las <strong>5:15 pm</strong> hasta las <strong>5:45 pm del 31/07/2025</strong>
          <br /> */}
          Estamos trabajando para brindarte una mejor experiencia.
        </p>
         {/* <p className="mt-4 text-gray-800 md:text-base">
          🕒 El servicio estará inactivo desde <strong>5:15 pm</strong> hasta <strong>5:45 pm </strong> del 31/07/2025
        </p> */}
        <div className="flex justify-center">
          <div className="flex space-x-2 animate-bounceDelay">
            <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-primary-600 rounded-full delay-150"></div>
            <div className="w-2.5 h-2.5 bg-primary-600 rounded-full delay-300"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500 italic">
          ¡Gracias por tu paciencia! 🛠️
        </p>
      </div>
    </main>
  );
}
