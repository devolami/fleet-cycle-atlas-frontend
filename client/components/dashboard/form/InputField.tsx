import { Input } from "@/ui/input";

import { InputFieldProps } from "@/client/types";

import { Label } from "../../ui/label";
import { useGeocoding } from "../hooks/useGeocoding";

export function InputField({
  config,
  register,
  errors,
  setValue,
}: InputFieldProps) {
  const { suggestions, onChange, onSelect, focusedField } = useGeocoding({
    setValue,
  });
  return (
    <>
      {config.map((fieldConfig, index) => (
        <div className="space-y-2">
          <Label
            htmlFor={fieldConfig.id}
            className="text-sm font-medium text-muted-foreground flex items-center gap-2"
          >
            <fieldConfig.icon className="w-4 h-4" />
            {fieldConfig.label}
          </Label>
          <Input
            id={fieldConfig.id}
            {...register(fieldConfig.name, fieldConfig.validationRules)}
            className="input-glass"
            placeholder={fieldConfig.placeholder}
            onChange={onChange(fieldConfig.name, index)}
          />
          {suggestions.length > 0 && focusedField === fieldConfig.name && (
            <div className="w-full h-32 p-5 overflow-x-hidden overflow-y-auto border-solid border-[#F4EBFF] z-10">
              <ul>
                {suggestions.map((suggestion) => (
                  <li
                    onClick={() =>
                      onSelect(fieldConfig.name, index, suggestion)
                    }
                    key={suggestion.id}
                    className="cursor-pointer m-4 text-yellow-600"
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {errors[fieldConfig.name] && (
            <p className="text-yellow-500 text-sm">
              {errors[fieldConfig.name]?.message}
            </p>
          )}
        </div>
      ))}
    </>
  );
}
