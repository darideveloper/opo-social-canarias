import { useState } from "react";
import clsx from "clsx";
import Input from "../../atoms/Input";
import ButtonAction from "../../atoms/ButtonAction";
import H1 from "../../atoms/H1";

type ResetPasswordFormProps = {
  token: string;
  onSubmit?: (payload: { token: string; password: string; confirmPassword: string }) => void;
  className?: string;
};

export default function ResetPasswordForm({ token, onSubmit, className }: ResetPasswordFormProps) {

  // States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [success, setSuccess] = useState(false);

  // Functions
  function validate() {
    const next: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      next.password = "La contraseña es obligatoria";
    } else if (password.length < 8) {
      next.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!confirmPassword) {
      next.confirmPassword = "Confirma tu contraseña";
    } else if (password !== confirmPassword) {
      next.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      onSubmit?.({ token, password, confirmPassword });
      // Simulate request 
      await new Promise((r) => setTimeout(r, 600));

      console.log("submit", { token, password, confirmPassword });
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className={
        clsx("w-full",
          "max-w-sm", "mx-auto",
          "bg-base-100", "shadow-md",
          className
        )
      }>
        <div className={clsx("card", "bg-base-100", "shadow-md")}>
          <div className={clsx("card-body", "gap-3")}>
            <div className={clsx("text-center", "mb-1")}>
              <H1 className="!text-xl">Contraseña Actualizada</H1>
              <p className={clsx("text-sm", "opacity-70", "mt-3")}>
                Tu contraseña ha sido actualizada exitosamente.
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
            </div>
            <div className={clsx("card-actions", "mt-2", "w-full")}>
              <a href="/login" className={clsx("w-full")}>
                <ButtonAction type="button" onClick={() => { }} isSoft className={clsx("w-full")}>
                  Ir al inicio de sesión
                </ButtonAction>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={
      clsx("w-full",
        "max-w-sm", "mx-auto",
        "bg-base-100", "shadow-md",
        className
      )
    }>
      <div className={clsx("card", "bg-base-100", "shadow-md")}>
        <div className={clsx("card-body", "gap-3")}>

          {/* Header */}
          <div className={clsx("text-center", "mb-1")}>
            <H1 className="!text-xl">Nueva Contraseña</H1>
            <p className={clsx("text-sm", "opacity-70")}>
              Ingresa tu nueva contraseña.
            </p>
          </div>

          {/* Password input */}
          <Input
            name="password"
            type="password"
            label="Nueva Contraseña"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete="new-password"
            required
          />

          {/* Confirm Password input */}
          <Input
            name="confirmPassword"
            type="password"
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          {/* Button */}
          <div className={clsx("card-actions", "mt-2", "w-full")}>
            <ButtonAction type="submit" onClick={handleSubmit} isSoft className={clsx("w-full")}>
              {isLoading ? "Actualizando..." : "Actualizar contraseña"}
            </ButtonAction>
          </div>

          <p className={clsx("text-center", "text-sm", "mt-1")}>
            ¿Recordaste tu contraseña? <a href="/login" className={clsx("link", "link-hover")}>Iniciar sesión</a>
          </p>
        </div>
      </div>
    </form>
  );
}


