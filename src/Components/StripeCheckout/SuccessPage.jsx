import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { useSelector } from "react-redux";

const SuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  const { currentUser } = useSelector((state) => state.user);
  const { completedOrder } = useSelector((state) => state.order);

  const buyer_id = currentUser?._id;
  const order_id = completedOrder?._id;
  const amount = completedOrder?.totalAmount; // Assuming you have totalAmount in the order

  useEffect(() => {
    const storeTransactionData = async () => {
      try {
        // Debugging: Log the data to ensure it is correct
        console.log("Session ID:", sessionId);
        console.log("Order ID:", order_id);
        console.log("Buyer ID:", buyer_id);
        console.log("Amount:", amount);

        // Ensure that sessionId, order_id, buyer_id, and amount are valid
        if (!sessionId || !order_id || !buyer_id || !amount) {
          console.log("Missing data, invalid session");
          setPaymentStatus("Invalid session data. Please try again.");
          toast.error("Invalid session data. Please try again.");
          return;
        }

        // Step 1: Verify payment using sessionId by querying Stripe API
        const stripeResponse = await axios.get(
          `https://backend-qyb4mybn.b4a.run/payment/verify-session/${sessionId}`
        );

        // Debugging: Log the response from the Stripe API
        console.log("Stripe response:", stripeResponse);

        // Check if the payment is successful
        if (stripeResponse.data.paymentStatus === "success") {
          // Step 2: If payment is successful, store transaction details
          await axios.post("https://backend-qyb4mybn.b4a.run/payment/success", {
            sessionId,
            order_id,
            buyer_id,
            amount,
          });

          setPaymentStatus(
            "Payment was successful! Thank you for your purchase."
          );
        } else {
          setPaymentStatus("Payment failed. Please try again.");
        }
      } catch (error) {
        // Log the error for debugging
        console.error("Error confirming payment:", error);
        setPaymentStatus(
          "There was an issue with your payment. Please contact support."
        );
        toast.error("Payment confirmation failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    storeTransactionData();
  }, [sessionId, order_id, buyer_id, amount]);

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-indigo-400 p-6 min-h-screen">
      <div className="bg-white shadow-2xl p-10 rounded-lg max-w-lg text-center transform transition duration-300 hover:scale-105">
        <h1 className="mb-6 font-bold text-4xl text-indigo-700">
          Payment Status
        </h1>
        {loading ? (
          <div className="flex flex-col justify-center items-center">
            <FaSpinner className="mb-4 text-5xl text-indigo-600 animate-spin" />
            <p className="font-semibold text-gray-600 text-lg">
              Confirming payment...
            </p>
          </div>
        ) : paymentStatus.includes("successful") ? (
          <div className="flex flex-col items-center">
            <FaCheckCircle className="mb-4 text-6xl text-green-500" />
            <p className="font-semibold text-gray-800 text-lg">
              {paymentStatus}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaTimesCircle className="mb-4 text-6xl text-red-500" />
            <p className="font-semibold text-gray-800 text-lg">
              {paymentStatus}
            </p>
          </div>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default SuccessPage;
