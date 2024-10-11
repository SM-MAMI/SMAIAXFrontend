/* tslint:disable */
/* eslint-disable */
/**
 * SMAIAXBackend.API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface Address
 */
export interface Address {
    /**
     * 
     * @type {string}
     * @memberof Address
     */
    'street'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Address
     */
    'city'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Address
     */
    'state'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Address
     */
    'zipCode'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Address
     */
    'country'?: string | null;
}
/**
 * 
 * @export
 * @interface LoginDto
 */
export interface LoginDto {
    /**
     * 
     * @type {string}
     * @memberof LoginDto
     */
    'username': string;
    /**
     * 
     * @type {string}
     * @memberof LoginDto
     */
    'password': string;
}
/**
 * 
 * @export
 * @interface Name
 */
export interface Name {
    /**
     * 
     * @type {string}
     * @memberof Name
     */
    'firstName'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Name
     */
    'lastName'?: string | null;
}
/**
 * 
 * @export
 * @interface ProblemDetails
 */
export interface ProblemDetails {
    [key: string]: any;

    /**
     * 
     * @type {string}
     * @memberof ProblemDetails
     */
    'type'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProblemDetails
     */
    'title'?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ProblemDetails
     */
    'status'?: number | null;
    /**
     * 
     * @type {string}
     * @memberof ProblemDetails
     */
    'detail'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProblemDetails
     */
    'instance'?: string | null;
}
/**
 * 
 * @export
 * @interface RegisterDto
 */
export interface RegisterDto {
    /**
     * 
     * @type {string}
     * @memberof RegisterDto
     */
    'email': string;
    /**
     * 
     * @type {string}
     * @memberof RegisterDto
     */
    'password': string;
    /**
     * 
     * @type {Name}
     * @memberof RegisterDto
     */
    'name': Name;
    /**
     * 
     * @type {Address}
     * @memberof RegisterDto
     */
    'address': Address;
}
/**
 * 
 * @export
 * @interface TokenDto
 */
export interface TokenDto {
    /**
     * 
     * @type {string}
     * @memberof TokenDto
     */
    'accessToken': string;
    /**
     * 
     * @type {string}
     * @memberof TokenDto
     */
    'refreshToken': string;
}

/**
 * AuthenticationApi - axios parameter creator
 * @export
 */
export const AuthenticationApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {LoginDto} [loginDto] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAuthenticationLoginPost: async (loginDto?: LoginDto, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/authentication/login`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(loginDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {TokenDto} [tokenDto] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAuthenticationRefreshPost: async (tokenDto?: TokenDto, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/authentication/refresh`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(tokenDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {RegisterDto} [registerDto] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAuthenticationRegisterPost: async (registerDto?: RegisterDto, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/authentication/register`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(registerDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AuthenticationApi - functional programming interface
 * @export
 */
export const AuthenticationApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AuthenticationApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {LoginDto} [loginDto] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiAuthenticationLoginPost(loginDto?: LoginDto, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TokenDto>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiAuthenticationLoginPost(loginDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationApi.apiAuthenticationLoginPost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {TokenDto} [tokenDto] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiAuthenticationRefreshPost(tokenDto?: TokenDto, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TokenDto>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiAuthenticationRefreshPost(tokenDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationApi.apiAuthenticationRefreshPost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {RegisterDto} [registerDto] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiAuthenticationRegisterPost(registerDto?: RegisterDto, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.apiAuthenticationRegisterPost(registerDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationApi.apiAuthenticationRegisterPost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AuthenticationApi - factory interface
 * @export
 */
export const AuthenticationApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AuthenticationApiFp(configuration)
    return {
        /**
         * 
         * @param {LoginDto} [loginDto] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAuthenticationLoginPost(loginDto?: LoginDto, options?: RawAxiosRequestConfig): AxiosPromise<TokenDto> {
            return localVarFp.apiAuthenticationLoginPost(loginDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {TokenDto} [tokenDto] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAuthenticationRefreshPost(tokenDto?: TokenDto, options?: RawAxiosRequestConfig): AxiosPromise<TokenDto> {
            return localVarFp.apiAuthenticationRefreshPost(tokenDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {RegisterDto} [registerDto] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiAuthenticationRegisterPost(registerDto?: RegisterDto, options?: RawAxiosRequestConfig): AxiosPromise<string> {
            return localVarFp.apiAuthenticationRegisterPost(registerDto, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AuthenticationApi - object-oriented interface
 * @export
 * @class AuthenticationApi
 * @extends {BaseAPI}
 */
export class AuthenticationApi extends BaseAPI {
    /**
     * 
     * @param {LoginDto} [loginDto] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthenticationApi
     */
    public apiAuthenticationLoginPost(loginDto?: LoginDto, options?: RawAxiosRequestConfig) {
        return AuthenticationApiFp(this.configuration).apiAuthenticationLoginPost(loginDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {TokenDto} [tokenDto] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthenticationApi
     */
    public apiAuthenticationRefreshPost(tokenDto?: TokenDto, options?: RawAxiosRequestConfig) {
        return AuthenticationApiFp(this.configuration).apiAuthenticationRefreshPost(tokenDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {RegisterDto} [registerDto] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthenticationApi
     */
    public apiAuthenticationRegisterPost(registerDto?: RegisterDto, options?: RawAxiosRequestConfig) {
        return AuthenticationApiFp(this.configuration).apiAuthenticationRegisterPost(registerDto, options).then((request) => request(this.axios, this.basePath));
    }
}



