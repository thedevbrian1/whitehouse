import { useMatches } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useMemo } from "react";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(id) {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );

  return route?.data;
}

function isUser(user) {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser() {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateLoginEmail(email) {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function validateEmail(email) {
  if (typeof email !== "string" || !email || email.length < 3 || !email.includes("@")) {
    return 'Email is invalid';
  }
}

export function validatePassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    return 'Password is required';
  } else if (password.length < 8) {
    return 'Password is too short';
  }
}

export function validateName(name) {
  if (typeof name !== "string" || name.length < 2) {
    return 'Name is invalid';
  }
}

export function validateMPESACode(code) {
  if (typeof code !== "string" || code.length < 10) {
    return 'The M-PESA code provided is invalid';
  }
}

export function trimPhone(phone) {
  return phone.replace(/\D+/g, '');
}

export function validatePhone(phone) {
  // if (typeof phone !== "string" || phone.length < 10) {
  //   return 'Phone number is invalid';
  // }
  const safariomRegex = /^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-3])|(?:4[68]))[0-9]{6})$/;

  const airtelRegex = /^(?:254|\+254|0)?(7(?:(?:3[0-9])|(?:5[0-6])|(?:8[0-2])|(?:8[6-9]))[0-9]{6})$/;

  const telkomRegex = /^(?:254|\+254|0)?(77[0-9][0-9]{6})$/;

  if (!phone.match(safariomRegex) && !phone.match(airtelRegex) && !phone.match(telkomRegex)) {
    return 'Phone number is invalid';
  }
}

export function validateNationalId(nationalId) {
  if (typeof nationalId !== "string" || nationalId.length < 4 || nationalId.length > 8) {
    return 'National id is invalid';
  }
}

export function validatePlotNumber(plotNo) {
  if (typeof plotNo !== "number" || !plotNo) {
    return 'Plot number is invalid';
  } else if (plotNo > 67) {
    return 'Plot should be 1-67'
  }
}

export function validateHouseNumber(houseNo) {
  const houseRegex = /[A-Za-z]*?[0-9]+[A-Za-z]?/;
  if (houseNo.length > 4) {
    return 'No of characters should be less than 5';
  } else if (!houseNo.match(houseRegex)) {
    return 'House number is invalid';
  }
}

export function validateDate(date) {
  if (typeof date !== "string") {
    return 'Date is invalid';
  }
}

export function validateVehicleRegistration(registration) {
  if (typeof registration !== "string") {
    return 'Registration is invalid';
  }
}

export function validateAmount(salary) {
  if (typeof salary !== "string" || !salary) {
    return 'Amount is invalid';
  }
}

export function validateCheckbox(value) {
  if (typeof value !== "string") {
    return 'Invalid value';
  }
}

export function validateYear(year) {
  const yearRegex = /^20\d{2}$/;
  if (!year.match(yearRegex)) {
    return 'Year should be between 2000 and 2099';
  }
}

export function validateMonth(month) {
  if (!months.includes(month)) {
    return 'Invalid month';
  }
}

export function badRequest(data) {
  return json(data, { status: 404 });
}

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];