"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { AccountInfo as AccountInfoModel } from "../models/account-info";

const SESSION_TOKEN: string = "SESSION_TOKEN";

export const IdentityContext = createContext<Identity>({
  sessionToken: undefined,
  setSessionToken: () => {},
  accountInfo: undefined,
});

interface Identity {
  sessionToken: string | undefined;
  setSessionToken: (value: string | undefined) => void;
  accountInfo: AccountInfo | undefined;
}

interface AccountInfo {
  username: string;
}

interface IdentityProviderProps {
  children: ReactNode;
}

export function IdentityProvider({ children }: IdentityProviderProps) {
  const [sessionToken, setSessionToken] = useState<string | undefined>(
    undefined,
  );
  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>(
    undefined,
  );

  useEffect(() => {
    setSessionToken(localStorage.getItem(SESSION_TOKEN) ?? undefined);
  }, []);

  useEffect(() => {
    const loadAccountInfo = async () => {
      const response = await fetch("http://localhost:8080/api/account/info", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.status !== 200) {
        // TODO: handle error on UI instead
        console.error(`non-successful status code: ${response.status}`);
      } else {
        const accountInfo = (await response.json()) as AccountInfoModel;
        setAccountInfo({
          username: accountInfo.username,
        });
      }
    };

    if (sessionToken) {
      loadAccountInfo();
    } else {
      setAccountInfo(undefined);
    }
  }, [sessionToken]);

  const handleSetSessionToken = (value: string | undefined) => {
    setSessionToken(value);

    if (value) {
      localStorage.setItem(SESSION_TOKEN, value);
    } else {
      localStorage.removeItem(SESSION_TOKEN);
    }
  };

  return (
    <IdentityContext.Provider
      value={{
        sessionToken,
        setSessionToken: handleSetSessionToken,
        accountInfo,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
}
