import * as yup from "yup";

export const signupValidation = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .trim("White space not allowed"),
  email: yup
    .string()
    .required("Email is required")
    .email("Enter valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Mininum 8 characters")
    .max(14, "Maximum 14 characters"),
});

export const loginValidation = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Mininum 8 characters")
    .max(14, "Maximum 14 characters"),
});

export const transactionValidation = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .min(1, "Minimum amount is 1")
    .required("Amount required")
    .positive("Amount can't be negative"),
  category: yup.string().required("Select a category"),
  note: yup.string().max(20, "Maximum 20 characters"),
});
