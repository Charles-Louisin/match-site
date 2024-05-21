'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({})
 
export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null)
    const supabase = createClientComponentClient();
    const [profile, setProfile] = useState(null)

    useEffect(() => {

        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }


        

        getUser();
    }, [])

    useEffect(()=> {
        if(!user?.id) {
            return;
        }

        supabase.from('profiles')
            .select()
            .eq('id', user?.id)
            .then(result => {
                // console.log(result);
                setProfile(result.data?.[0])
            })
    }, [user?.id])

    return (
        <UserContext.Provider value={{ profile }}>
            {children}
        </UserContext.Provider>
    )
}