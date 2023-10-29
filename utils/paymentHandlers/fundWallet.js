const dotenv = require('dotenv');
const {createAPIUserAndKey, TargetEnvironment, createRemittanceAPI, PartyIDVariant, createCollectionAPI } = require("mtn-momo-client");
const Wallet = require("../../models/walletModel");


dotenv.config();

const remittancePrimaryKey  = process.env.REM_SUB_KEY;
let remittanceAPI

const remyFunc = async () => {
  const config = await createAPIUserAndKey({
    providerCallbackHost: 'http://localhost',
    subscriptionKey: remittancePrimaryKey,
    targetEnvironment: TargetEnvironment.Sandbox,
  });
  remittanceAPI = createRemittanceAPI(config)
}

remyFunc();

const collectionPrimaryKey = process.env.COL_SUB_KEY;
let collectionAPI

const collectionFunc = async (req,res) =>{
  const data = await createAPIUserAndKey({
    providerCallbackHost: 'http://localhost',
    subscriptionKey: collectionPrimaryKey,
    targetEnvironment: TargetEnvironment.Sandbox,
  });
  collectionAPI = createCollectionAPI(dotenv.config)
};

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

const requestToFundWallet = async(amount, payerMoMoNumber, description) =>{
  try {
    const { referenceId } = await collectionAPI.requestToPay({
      amount: amount,
      currency: 'EUR',
      externalId: payerMoMoNumber,
      payer: {
        partyIdType: PartyIDVariant.MSISDN,
        partyId: '256779840633',
      },
      payerMessage: description,
      payeeNote: description,
    });
    return referenceId;
  } catch (error) {
    console.error(error);
    return { error: true };
  }
}

module.exports = {
  transfer,
  requestToFundWallet,
};
