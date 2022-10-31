import { validateLoginEmail } from "./utils";

test("validateEmail returns false for non-emails", () => {
  expect(validateLoginEmail(undefined)).toBe(false);
  expect(validateLoginEmail(null)).toBe(false);
  expect(validateLoginEmail("")).toBe(false);
  expect(validateLoginEmail("not-an-email")).toBe(false);
  expect(validateLoginEmail("n@")).toBe(false);
});

test("validateEmail returns true for emails", () => {
  expect(validateLoginEmail("kody@example.com")).toBe(true);
});
