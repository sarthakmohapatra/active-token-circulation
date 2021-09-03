import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatBadRequestError, formatJSONResponse } from "@libs/apiGateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import config from "src/constants/config";
import { toFraction } from "@libs/BigNumber";
import ERC20ABI from "src/constants/erc20Abi";

const tokenSupply: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log("inside handler");

  try {
    const infuraURL = `wss://eth-mainnet.ws.alchemyapi.io/v2/Qa6tvFeHbxregvy3m_UPoo_FuYFrBlfY`;
    console.log("infura url", infuraURL);
    const web3Provider = new Web3.providers.WebsocketProvider(infuraURL);
    console.log("web3Provider", web3Provider.toString());
    const web3 = new Web3(web3Provider);
    console.log("web3", web3.toString());
    console.log("event query", event.queryStringParameters);
    console.log("tokenSymbol query", event.queryStringParameters.tokensymbol);
    if (!event?.queryStringParameters || !event.queryStringParameters?.tokensymbol) {
      console.log("No Token symbol found");
      return formatJSONResponse({
        message: "No Token symbol found",
      });
    }
    // return formatJSONResponse({
    //   message: " Token symbol found",
    // });
    const tokenSymbol = event.queryStringParameters.tokensymbol;
    console.log("Token from query params", tokenSymbol);
    const token = config.tokens.find((el) => el.symbol === tokenSymbol);
    console.log("Token details", JSON.stringify(token));
    if (!token) {
      return formatBadRequestError("Invalid Token Symbol");
    }
    //@ts-ignore
    const tokenContract = new web3.eth.Contract(ERC20ABI, token.address);
    const [decimals, totalSupply] = await Promise.all([
      tokenContract.methods["decimals"]().call(),
      tokenContract.methods["totalSupply"]().call(),
    ]);
    console.log("decimals", decimals);
    console.log("totalsupply", totalSupply);

    const totalSupplyBN = toFraction(totalSupply.toString(), decimals);
    console.log("totalSupplyBN", totalSupplyBN.toString());
    let balanceToBeExcluded = 0;

    if (token.excludeBalancesOf.length !== 0) {
      const excludeBalancePromises = token.excludeBalancesOf.map((account) => {
        return tokenContract.methods["balanceOf"](account).call();
      });

      let excludeBalances = await Promise.all(excludeBalancePromises);
      console.log("exclude Balances of", excludeBalances);
      excludeBalances = excludeBalances.map((balance) => toFraction(balance, decimals));
      console.log("excludeBalanceBN", excludeBalances.toString());
      balanceToBeExcluded = excludeBalances.reduce((acc: BigNumber, cur: BigNumber) => {
        return acc.plus(cur);
      }, new BigNumber(0));
      console.log("balanceToBeExcluded", balanceToBeExcluded.toString());
    }

    const activeCirculationBalance = totalSupplyBN.minus(balanceToBeExcluded);
    console.log("activecirculation", activeCirculationBalance.toString());
    return formatJSONResponse({
      totalSupply: totalSupplyBN.precision(6),
      activeCirculationBalance: activeCirculationBalance.precision(6),
      tokenSymbol: token.symbol,
      tokenName: token.name,
    });
  } catch (error) {
    console.log("Something went wrong error", error);
    return formatJSONResponse({
      error: error.message,
    });
  }
};

export const main = middyfy(tokenSupply);
