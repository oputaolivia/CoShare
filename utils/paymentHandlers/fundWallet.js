
// Function to fund the user's wallet using MTN MoMo API
async function fundWallet(user, amount, payeeMomoNumber) {
    const requestPayload = {
      amount,
      currency: 'USD', // Adjust currency as needed
      externalId: 'your_external_id', // Generate a unique ID for the transaction
      payer: {
        partyIdType: 'MSISDN',
        partyId: 'payer_momo_number', // Replace with the payer's MoMo number
      },
      payee: {
        partyIdType: 'MSISDN',
        partyId: payeeMomoNumber, // Payee's MoMo number
      },
    };
  
    try {
      const response = await axios.post(
        'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
        requestPayload,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': API_KEY,
            'Ocp-Apim-Subscription-User': API_SECRET,
            'X-Target-Environment': 'sandbox',
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Handle the response, you can check the status and log it if needed
      return { success: true };
    } catch (error) {
      console.error(error);
      return { error: true };
    }
  }