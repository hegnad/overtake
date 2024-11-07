"use client"

import { useState, useEffect, useContext } from "react"
import { IdentityContext } from "../lib/context/identity";
import SidebarLayout from "../ui/sidebar-layout";

export default function Profile() {
    const identity = useContext(IdentityContext);


    return (
        <SidebarLayout>
            {identity.accountInfo && (
                <div>
                    <div>
                        {identity.accountInfo.username}
                    </div>
                    <div>
                        <img src="/images/logo.svg" alt="Overtake Logo"/>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}