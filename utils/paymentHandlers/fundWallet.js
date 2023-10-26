const dotenv = require('dotenv');
const {createAPIUserAndKey, TargetEnvironment, createRemittanceAPI, PartyIDVariant } = require("mtn-momo-client");
const Wallet = require("../../models/walletModel");


dotenv.config();

const subscriptionKey = process.env.SUB_KEY;

const creatApi = async (req,res) =>{
  const data = await createAPIUserAndKey({
    providerCallbackHost: 'http://localhost',
    subscriptionKey,
    targetEnvironment: TargetEnvironment.Sandbox,
  });

  return res.status(201).send({
    data,
    message: `User created`,
    status: 0,
  })
};

const remittancePrimaryKey = subscriptionKey;
let remittanceAPI

const remyFunc = async () => {
  const config = await createAPIUserAndKey({
    providerCallbackHost: 'http://localhost',
    subscriptionKey: remittancePrimaryKey,
  });
  remittanceAPI = createRemittanceAPI(config)
}

remyFunc();

const transfer = async(amount, payeeMomoNumber, description) =>{
    try {
      const { referenceId } = await remittanceAPI.transfer({
        amount: amount,
        currency: 'EUR',
        externalId: '123456789',
        payee: {
          partyIdType: PartyIDVariant.MSISDN,
          partyId: payeeMomoNumber,
        },
        payerMessage: description,
        payeeNote: description,
      });
      return referenceId;
    } catch (error) {
      console.error(error);
    return { error: true };
    }
};

const fundWallet = async (user, amount, payeeMomoNumber) => {
  const requestPayload = {
    amount,
    currency: "NGN", // Adjust currency as needed
    externalId: "your_external_id", // Generate a unique ID for the transaction
    payer: {
      partyIdType: "MSISDN",
      partyId: user, // Replace with the payer's MoMo number
    },
    payee: {
      partyIdType: "MSISDN",
      partyId: payeeMomoNumber, // Payee's MoMo number
    },
  };

  try {
    const response = await axios.post(
      "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
      requestPayload,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": API_KEY,
          "Ocp-Apim-Subscription-User": API_SECRET,
          "X-Target-Environment": "sandbox",
          "Content-Type": "application/json",
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

module.exports = {
  transfer,
  creatApi,
};
