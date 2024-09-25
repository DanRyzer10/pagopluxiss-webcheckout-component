import IssPaymentButton from "./config/IssPaymentButton";

declare global {
  interface Window {
	IssPaymentButton: typeof IssPaymentButton;
  }
}

window.IssPaymentButton = IssPaymentButton;