import { ErrorIcon } from "./img/ErrorIcon";

interface ErrorHandlerProps {
  businessname: string;
  email: string;
  number: string;
}

export function ErrorHandler({
  businessname,
  email,
  number,
}: ErrorHandlerProps) {
  return (
    <div style={{ textAlign: "left", padding: 10 }}>
      <ErrorIcon />
      <h1 style={{ marginBottom: 14 }} class="ppxiss-error-title">
        Ups! Algo ha salido mal.
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
      <button class="ppxiss-buttom-error-fallbck">Salir</button>
    </div>
  );
}
