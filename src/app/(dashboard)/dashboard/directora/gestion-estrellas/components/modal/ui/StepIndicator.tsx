import { STEPS, StepValidation } from "@/hooks/useCreateClient";
import { Check } from "@phosphor-icons/react";

type Props = {
  currentStep: number;
  stepValidations: Record<number, StepValidation>;
};

const StepIndicator = ({ currentStep, stepValidations }: Props) => {
  return (
    <div className="space-y-6 mb-8">
      <div className="relative flex justify-between">
        {STEPS.map((step, index) => {
          const stepNum = index + 1;
          const validation = stepValidations[stepNum];
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep && validation?.isValid;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative flex items-center justify-center w-full">
                {/* Progress Line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`absolute h-[3px] w-full left-[50%] top-1/2 transform -translate-y-1/2
                      ${isCompleted ? "bg-blue-500" : "bg-gray-200"}`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full 
                    transition-all duration-200 border-2
                    ${
                      isActive
                        ? "bg-white border-blue-500 text-blue-500"
                        : isCompleted
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-200 text-gray-400"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepNum}</span>
                  )}
                </div>
              </div>

              {/* Step Title */}
              <span
                className={`mt-3 text-sm font-medium text-center
                  ${
                    isActive
                      ? "text-blue-500"
                      : isCompleted
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Description */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {STEPS[currentStep - 1].description}
        </p>
        {(stepValidations[currentStep]?.errors?.length ?? 0) > 0 && (
          <p className="mt-2 text-sm font-medium text-red-500">
            {stepValidations[currentStep].errors?.[0]}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepIndicator;
