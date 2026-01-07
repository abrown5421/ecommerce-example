import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { useEffect, useState } from "react";
import { Address } from "../../types/user.types";
import { openAlert } from "../../features/alert/alertSlice";
import { useGetPendingOrderQuery } from "../../app/store/api/ordersApi";
import Loader from "../../features/loader/Loader";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../../features/orderSummary/OrderSummary";

interface CheckoutFormState {
  firstName: string;
  lastName: string;
  email: string;
  mailingAddress: Address;
  billingAddress: Address;
  sameAddress: boolean;
  payment: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
}

type CheckoutErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  mailingAddress?: Partial<Record<keyof Address, string>>;
  billingAddress?: Partial<Record<keyof Address, string>>;
  payment?: {
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
  };
};

const emptyAddress: Address = {
  addrLine1: "",
  addrLine2: "",
  addrCity: "",
  addrState: "",
  addrZip: 0,
};

const FormInput = ({
  name,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  className = "",
}: any) => (
  <div className={`flex flex-col ${className}`}>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-2 rounded border ${
        error ? "border-red-500" : "border-transparent"
      } focus:outline-none focus:ring-2 focus:ring-primary bg-neutral`}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

const AddressSection = ({ prefix, address, errors, onChange }: any) => (
  <div className="grid md:grid-cols-2 gap-4">
    <FormInput
      name={`${prefix}.addrLine1`}
      value={address.addrLine1}
      onChange={onChange}
      placeholder="Address Line 1"
      error={errors?.addrLine1}
      className="md:col-span-2"
    />
    <input
      name={`${prefix}.addrLine2`}
      value={address.addrLine2}
      onChange={onChange}
      placeholder="Address Line 2"
      className="p-2 md:col-span-2 rounded border border-transparent focus:outline-none focus:ring-2 focus:ring-primary bg-neutral"
    />
    <FormInput
      name={`${prefix}.addrCity`}
      value={address.addrCity}
      onChange={onChange}
      placeholder="City"
      error={errors?.addrCity}
    />
    <FormInput
      name={`${prefix}.addrState`}
      value={address.addrState}
      onChange={onChange}
      placeholder="State"
      error={errors?.addrState}
    />
    <FormInput
      name={`${prefix}.addrZip`}
      value={address.addrZip || ""}
      onChange={onChange}
      placeholder="Zip Code"
      error={errors?.addrZip}
      className="md:col-span-2"
    />
  </div>
);

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: orderData,
    isLoading,
    error,
  } = useGetPendingOrderQuery(user?._id!);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [form, setForm] = useState<CheckoutFormState>({
    firstName: "",
    lastName: "",
    email: "",
    mailingAddress: emptyAddress,
    billingAddress: emptyAddress,
    sameAddress: true,
    payment: { cardNumber: "", expiry: "", cvv: "" },
  });

  const isNumeric = (value: string) => /^\d+$/.test(value);
  const isExpiryValid = (value: string) =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);

  const validateAddress = (address: Address) => {
    const addrErrors: any = {};
    if (!address.addrLine1) addrErrors.addrLine1 = "Address line 1 is required";
    if (!address.addrCity) addrErrors.addrCity = "City is required";
    if (!address.addrState) addrErrors.addrState = "State is required";
    if (!address.addrZip) {
      addrErrors.addrZip = "Zip code is required";
    } else if (!isNumeric(String(address.addrZip))) {
      addrErrors.addrZip = "Zip code must be numeric";
    }
    return addrErrors;
  };

  const validate = () => {
    let valid = true;
    const newErrors: CheckoutErrors = {};

    if (!form.firstName) {
      newErrors.firstName = "First name is required";
      valid = false;
    }
    if (!form.lastName) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }
    if (!form.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!form.email.includes("@") || !form.email.includes(".")) {
      newErrors.email = "Email must be valid";
      valid = false;
    }

    const mailingErrors = validateAddress(form.mailingAddress);
    if (Object.keys(mailingErrors).length) {
      newErrors.mailingAddress = mailingErrors;
      valid = false;
    }

    if (!form.sameAddress) {
      const billingErrors = validateAddress(form.billingAddress);
      if (Object.keys(billingErrors).length) {
        newErrors.billingAddress = billingErrors;
        valid = false;
      }
    }

    const paymentValidations = [
      {
        field: "cardNumber",
        message: "Card number is required",
        validator: () => !form.payment.cardNumber,
      },
      {
        field: "cardNumber",
        message: "Card number must be numeric",
        validator: () =>
          form.payment.cardNumber && !isNumeric(form.payment.cardNumber),
      },
      {
        field: "expiry",
        message: "Expiry date is required",
        validator: () => !form.payment.expiry,
      },
      {
        field: "expiry",
        message: "Format must be MM/YY",
        validator: () =>
          form.payment.expiry && !isExpiryValid(form.payment.expiry),
      },
      {
        field: "cvv",
        message: "CVV is required",
        validator: () => !form.payment.cvv,
      },
      {
        field: "cvv",
        message: "CVV must be numeric",
        validator: () => form.payment.cvv && !isNumeric(form.payment.cvv),
      },
    ];

    paymentValidations.forEach(({ field, message, validator }) => {
      if (validator()) {
        newErrors.payment = { ...newErrors.payment, [field]: message };
        valid = false;
      }
    });

    setErrors(newErrors);

    if (!valid) {
      dispatch(
        openAlert({
          open: true,
          closeable: true,
          severity: "error",
          message: "There were errors in your form",
          anchor: { x: "right", y: "bottom" },
        })
      );
    }

    return valid;
  };

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      mailingAddress: user.mailingAddress ?? emptyAddress,
      billingAddress: user.billingAddress ?? emptyAddress,
      sameAddress: user.sameAddress ?? true,
    }));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        if (parent === "mailingAddress" || parent === "billingAddress") {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: child === "addrZip" ? Number(finalValue) : finalValue,
            },
          };
        }
        if (parent === "payment") {
          return {
            ...prev,
            payment: { ...prev.payment, [child]: finalValue },
          };
        }
      }
      if (name === "sameAddress") {
        return {
          ...prev,
          sameAddress: finalValue as boolean,
          billingAddress: finalValue
            ? prev.mailingAddress
            : prev.billingAddress,
        };
      }
      return { ...prev, [name]: finalValue };
    });

    setErrors((prev) => ({ ...prev }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("order placed!");
  };

  useEffect(() => {
    if (form.sameAddress) {
      setForm((prev) => ({ ...prev, billingAddress: prev.mailingAddress }));
    }
  }, [form.mailingAddress, form.sameAddress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral sup-min-nav relative z-0 p-4"
    >
      {isLoading ? (
        <Loader />
      ) : error || !orderData ? (
        <div className="text-center text-red-500 mt-10 font-primary">
          <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-neutral-500">
            Sorry, there was a problem please try again later.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-contrast font-primary">Checkout</h1>
            <p className="text-neutral-contrast mt-1">
              {orderData.order_item_count} {orderData.order_item_count === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral3 rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white font-primary">
                  Customer Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormInput
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    error={errors.firstName}
                  />
                  <FormInput
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    error={errors.lastName}
                  />
                  <FormInput
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    error={errors.email}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="bg-neutral3 rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white font-primary">
                  Mailing Address
                </h2>
                <AddressSection
                  prefix="mailingAddress"
                  address={form.mailingAddress}
                  errors={errors.mailingAddress}
                  onChange={handleChange}
                />
                <label className="flex items-center gap-2 text-neutral-contrast text-sm">
                  <input
                    type="checkbox"
                    name="sameAddress"
                    checked={form.sameAddress}
                    onChange={handleChange}
                  />
                  Billing address is the same as mailing
                </label>
              </div>

              <AnimatePresence initial={false}>
                {!form.sameAddress && (
                  <motion.div
                    key="billing-address"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.35 },
                      opacity: { duration: 0.2 },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="bg-neutral3 rounded-lg p-6 space-y-4">
                      <h2 className="text-xl font-semibold text-white font-primary">
                        Billing Address
                      </h2>
                      <AddressSection
                        prefix="billingAddress"
                        address={form.billingAddress}
                        errors={errors.billingAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-neutral3 rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white font-primary">
                  Payment Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormInput
                    name="payment.cardNumber"
                    value={form.payment.cardNumber}
                    onChange={handleChange}
                    placeholder="Card Number"
                    error={errors.payment?.cardNumber}
                    className="md:col-span-2"
                  />
                  <FormInput
                    name="payment.expiry"
                    value={form.payment.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    error={errors.payment?.expiry}
                  />
                  <FormInput
                    name="payment.cvv"
                    value={form.payment.cvv}
                    onChange={handleChange}
                    placeholder="CVV"
                    error={errors.payment?.cvv}
                  />
                </div>
              </div>
            </div>
            <OrderSummary 
              orderData={orderData} 
              mode="checkout"
              onPrimaryAction={handleSubmit}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Checkout;
