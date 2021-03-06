"use strict";
import { makeRequest } from "../request";

const base64Encode = (encodeData) => {
  const buff = Buffer.from(encodeData);
  return buff.toString("base64");
};

export const setAccessToken = function (token) {
  this.options.access_token = token;
};

export const getAccessToken = function () {
  if (!this.options.clientID) throw new Error("Missing Client ID");
  if (!this.options.clientSecret)
    throw new Error("Missing Client Secret or Cert Id");
  if (!this.options.body) throw new Error("Missing Body, required Grant type");
  const encodedStr = base64Encode(
    this.options.clientID + ":" + this.options.clientSecret
  );
  const self = this;
  const auth = "Basic " + encodedStr;
  this.options.contentType = "application/x-www-form-urlencoded";
  return makeRequest(
    this.options,
    "/identity/v1/oauth2/token",
    "POST",
    auth
  ).then((result: any) => {
    const resultJSON = JSON.parse(result);
    self.setAccessToken(resultJSON.access_token);
    return resultJSON;
  });
};

export const setHeaders = (self, headerObj) => {
  self.headers = Object.assign({}, self.headers, headerObj);
};

export const upperCase = (data) => {
  if (!isString(data)) data = data.toString();
  return data.toUpperCase();
};

// Returns if a value is a string
const isString = (value) => {
  return typeof value === "string" || value instanceof String;
};

// Returns if object is empty or not
const isEmptyObj = (obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const encodeURLQuery = (url) => {
  return encodeURIComponent(url).replace(/'/g, "%27").replace(/"/g, "%22");
};

// parses the object and converts it into query params.
export const parseObj = (options, url = "") => {
  if (options) {
    for (let key in options) {
      url = `${url}&${key}=${options[key]}`;
    }
  }
  return url;
};

export const parseJson = (result: string) => JSON.parse(result);
