import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import ErrorHandler from "./errorHandler";

const validatePhoneNumber = (phoneNumber: string): string | ErrorHandler => {
  const phoneUtil = PhoneNumberUtil.getInstance();

  try {
    const number = phoneUtil.parse(phoneNumber);
    if (phoneUtil.isValidNumber(number)) {
      return phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL);
    } else {
      return new ErrorHandler("Invalid phone number", 400);
    }
  } catch (err) {
    return new ErrorHandler("Internal Server Error", 500);
  }
};

export default validatePhoneNumber;
