import { useState } from "react";
import clsx from "clsx";
import Input from "../../ui/Input";
import ButtonAction from "../../ui/ButtonAction";
import H1 from "../../atom/H1";

type FormsProps = {
  onSubmit?: (payload: { email: string; password: string }) => void;
  className?: string;
};

export default function Forms({ onSubmit, className }: FormsProps) {

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Functions
  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!email) next.email = "El email es obligatorio";
    if (!password) next.password = "La contraseña es obligatoria";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      onSubmit?.({ email, password });
      // Simulate request 
      await new Promise((r) => setTimeout(r, 600));

      console.log("submit", { email, password });
    } finally {
      setIsLoading(false);
    }
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
            <H1 className="!text-xl">Iniciar Sesión</H1>
            <p className={clsx("text-sm", "opacity-70")}>Accede a tu panel de control.</p>
          </div>

          {/* Email input */}
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            autoComplete="email"
            required
          />

          {/* Passoword extra lavel */}
          <label className={clsx("label", "justify-between", "pt-0")}>
            <span className="label-text">Contraseña</span>
            <a href="#" className={clsx("label-text-alt", "link", "link-hover")}>¿Olvidaste tu contraseña?</a>
          </label>

          {/* Password input */}
          <Input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={setPassword}
            error={errors.password}
            autoComplete="current-password"
            required
          />

          {/* Button */}
          <div className={clsx("card-actions", "mt-2", "w-full")}>
            <ButtonAction type="submit" onClick={handleSubmit} isSoft className={clsx("w-full")}>
              {isLoading ? "Entrando..." : "Entrar"}
            </ButtonAction>
          </div>

          <p className={clsx("text-center", "text-sm", "mt-1")}>
            ¿No tienes una cuenta? <a href="#" className={clsx("link", "link-hover")}>Regístrate</a>
          </p>
        </div>
      </div>
    </form>
  );
}


