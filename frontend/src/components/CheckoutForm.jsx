import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Divider
} from "@mui/material";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "../context/AuthContext";
import api from "../utils/baseUrlApi";
import { toast } from "react-toastify";

// =========  ORDER PAYMENT FORM / MODAL =====================
const CheckoutForm = ({ data, setData, open, handleClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!data) {
      toast.warning("Please select unpaid order.");
      return;
    }
    try {
      // ============== CHECK PAYMENT INTENT AND CHECK STATUS =================
      const res = await api.post(
        "/order/create-payment-intent",
        { orderId: data?._id },
        { headers: { Authorization: token } }
      );
      const result = await stripe.confirmCardPayment(
        res?.data?.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );
      if (result.error) {
        toast.warning(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") { // === PAYMENT CONFIRMATION
        await api.put(
          "/order/mark-paid",
          {
            orderId: data?._id,
            paymentId: result.paymentIntent.id,
          },
          { headers: { Authorization: token } }
        );
        toast.success("Payment Successful 🎉");
        setData("");
        handleClose();
      }
    } catch (error) {
      toast.error("Payment failed");
    }
  };
  const cardOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
      },
      invalid: { color: "#fa755a" },
    },
  };
  return (
    <Dialog // PAYMENT DIALOG OR FORM
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Complete Your Payment</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}
        >
          {/* LEFT SIDE - Payment Form */}
          <Grid sx={{
            xs: 12,
            md: 6,
            justifyContent: "space-evenly",
          }}>
            <Typography variant="h6" mb={2}>
              Secure Card Payment
            </Typography>
            <Box
              sx={{
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            >
              <CardElement options={cardOptions} />
            </Box>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              fullWidth
              onClick={handleSubmit}
            >
              Pay Now
            </Button>
          </Grid>
          {/* RIGHT SIDE - Order Details */}
          <Grid
            sx={{
              xs: 12,
              md: 6,
            }}
          >
            <Typography variant="h6" mb={2}>
              Order Details
            </Typography>
            {data ? (
              <Box>
                <Typography>
                  <strong>Order ID:</strong> {data?._id}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography>
                  <strong>Total Amount:</strong> Rs. {data?.totalPrice}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {data?.orderStatus}
                </Typography>
                {/* IF ANY ITEMS EXIST  */}
                {data?.orderItems?.map((item, index) => (
                  <Box key={index} mt={1}>
                    {item.title} × {item.quantity}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="error">
                No order selected.
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export default CheckoutForm;