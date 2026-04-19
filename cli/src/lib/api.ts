import {
  ApiErrorResponse,
  type RegisterUserResponse,
  type VerifyUserResponse,
  type RegisterAgentInput,
  type RegisterAgentResponse,
  type TopupBalanceResponse,
  type BalanceResponse,
} from "../types.js";

async function request<T>(
  url: string,
  init: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let parsed: unknown;
    try {
      parsed = await res.json();
    } catch {
      throw new ApiErrorResponse(res.status, {
        code: "http_error",
        message: `HTTP ${res.status}`,
      });
    }
    const err =
      parsed && typeof parsed === "object" && "error" in parsed
        ? (parsed as { error: unknown }).error
        : null;
    if (err && typeof err === "object" && "code" in err && "message" in err) {
      throw new ApiErrorResponse(res.status, err as { code: string; message: string });
    }
    throw new ApiErrorResponse(res.status, {
      code: "http_error",
      message: `HTTP ${res.status}`,
    });
  }
  return (await res.json()) as T;
}

function jsonPost(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

function bearer(token: string, init: RequestInit): RequestInit {
  return {
    ...init,
    headers: { ...(init.headers as Record<string, string> ?? {}), authorization: `Bearer ${token}` },
  };
}

export function registerUser(
  apiUrl: string,
  body: { email: string },
): Promise<RegisterUserResponse> {
  return request(`${apiUrl}/v1/register_user`, jsonPost(body));
}

export function verifyUser(
  apiUrl: string,
  body: { email: string; verification_token: string },
): Promise<VerifyUserResponse> {
  return request(`${apiUrl}/v1/verify_user`, jsonPost(body));
}

export function registerAgent(
  apiUrl: string,
  userToken: string,
  body: RegisterAgentInput,
): Promise<RegisterAgentResponse> {
  return request(`${apiUrl}/v1/register_agent`, bearer(userToken, jsonPost(body)));
}

export function topupBalance(
  apiUrl: string,
  userToken: string,
  body: { amount_cents: number },
): Promise<TopupBalanceResponse> {
  return request(`${apiUrl}/v1/topup_balance`, bearer(userToken, jsonPost(body)));
}

export function getBalance(apiUrl: string, userToken: string): Promise<BalanceResponse> {
  return request(`${apiUrl}/v1/balance`, bearer(userToken, { method: "GET" }));
}
