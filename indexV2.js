import {fetchRequest} from './fetchRequest';

export const getStatementTransactions = async (authorization, statementKey) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/statements/${statementKey}/transactions`,
        method: 'GET',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const getExistingStatementAnalytics = async (
  authorization,
  statementKey,
) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/statements/${statementKey}`,
        method: 'GET',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const generateCreditScoreForAStatement = async (
  authorization,
  statementKey,
) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/creditscore/${statementKey}`,
        method: 'POST',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const getAnExistingCreditScore = async (authorization, statementKey) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/creditscore/${statementKey}`,
        method: 'GET',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const getExistingStatementAffordabilityAnalysis = async (
  authorization,
  statementKey,
) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/affordability/${statementKey}`,
        method: 'GET',
      });

      return {status: true, data: response};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};

export const attachCustomerIdentificationInformationToAStatement = async (
  authorization,
  statementKey,
  identificationData,
) => {
  if (!statementKey) {
    throw {status: false, msg: 'Please include a statement key'};
  } else {
    try {
      const response = await fetchRequest({
        authorization,
        path: `/statements/identification`,
        method: 'PATCH',
        data: {statementKey, identificationData},
      });

      return {status: true};
    } catch (error) {
      throw {status: false, msg: error?.msg || error};
    }
  }
};
