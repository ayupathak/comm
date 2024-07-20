import React from "react";
import { cn } from "~/lib/utils";
import Spinner from "./spinner";

type FormButtonProps = {
  loading: boolean;
  disabled: boolean;
  className: string;
  children: React.ReactNode;
};

const FormButton = ({ children, disabled,  className, loading }: FormButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        `flex w-full justify-center rounded-lg border-none bg-black py-3 font-semibold outline-none`,
        `${(loading || disabled) && "bg-slate-500"}`,
        className,
      )}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="inline-block text-slate-400">Loading...</span>
        </div>
      ) : (
        <span className="text-white">{children}</span>
      )}
    </button>
  );
};

export default FormButton;
