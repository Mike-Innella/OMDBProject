export const simulatePayment = (paymentInfo) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `MOCK-${Date.now()}`,
        message: "Payment processed successfully (simulated)",
      });
    }, 1500);
  });
};
