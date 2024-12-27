import { ErrorIcon } from "./img/ErrorIcon";

interface ErrorHandlerProps {
  businessname: string;
  email: string;
  number: string;
  title?: string;
  fallback: Function;
  description?: string;
  isException?: boolean;
}

export function ErrorHandler({
  businessname,
  email,
  fallback,
  title,
  number,
}: ErrorHandlerProps) {
  return (
    <div style={{ textAlign: "left", padding: 10 }}>
      <ErrorIcon />
      <h1 style={{ marginBottom: 14 }} class="ppxiss-error-title">
        {title}
      </h1>
      <p>
        Su solicitud no pudo ser procesada, por favor comuníquese con{" "}
        <span style={{ fontWeight: 700 }}>{businessname}</span>
      </p>
      <p style={{ marginBottom: 10 }}>Canales de servicio al cliente:</p>
      <ul style={{ listStyle: "disc", paddingLeft: 20, marginBottom: 10 }}>
        <li style={{ fontWeight: 500 }}>{email}</li>
        <li style={{ fontWeight: 500 }}>{number}</li>
      </ul>
      <button onClick={() => fallback()} class="ppxiss-buttom-error-fallbck">
        Reintentar
      </button>
    </div>
  );
}