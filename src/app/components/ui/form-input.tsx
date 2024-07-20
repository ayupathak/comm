
import React from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className='flex flex-col gap-2 w-full'>
      <label htmlFor={name} className='block text-ct-blue-600 mb-3'>
        {label}
      </label>
      <input
        type={type}
        placeholder=' '
        className='block w-full border rounded-md appearance-none focus:outline-none py-2 px-4'
        {...register(name)}
      />
      {errors[name] && (
        <span className='text-red-500 text-xs pt-1 block'>
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput