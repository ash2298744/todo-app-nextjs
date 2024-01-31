import { createContext, useState, useEffect, useContext } from "react";
import {onAuthStateChanged, signOut as authSignOut} from "firebase/auth";
import { auth } from "./firebase";

const AuthUserContext = createContext({
    authUser: null,
    isLoading: true
});

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const authStateChanged = async (user) => {
        setIsLoading(true);
        if(!user) {
            setAuthUser(null);
            setIsLoading(false);
            
        } else {
            setAuthUser({
                uid: user.uid,
                email: user.email,
                username: user.displayName
            })
            setIsLoading(false);
        }

    };

    const signOut = () => {
        authSignOut(auth).then(() => {
            setAuthUser(null);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser,
        isLoading,
        setAuthUser,
        signOut
    }
};

export const AuthUserProvider = ({children}) => {
    const auth = useFirebaseAuth();

    return (
        <AuthUserContext.Provider value={auth}>
            {children}
        </AuthUserContext.Provider>
    )
};

export const useAuth = () => useContext(AuthUserContext);