/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as certificates from "../certificates.js";
import type * as courses from "../courses.js";
import type * as http from "../http.js";
import type * as instructors from "../instructors.js";
import type * as lessons from "../lessons.js";
import type * as payment from "../payment.js";
import type * as router from "../router.js";
import type * as sampleData from "../sampleData.js";
import type * as storage from "../storage.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  certificates: typeof certificates;
  courses: typeof courses;
  http: typeof http;
  instructors: typeof instructors;
  lessons: typeof lessons;
  payment: typeof payment;
  router: typeof router;
  sampleData: typeof sampleData;
  storage: typeof storage;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
