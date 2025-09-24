import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userId");
        if (storedUser) {
            setUser({
                id: localStorage.getItem("userId"),
                email: localStorage.getItem("email"),
                name: localStorage.getItem("name"),
                lastname: localStorage.getItem("lastname"),
                role: localStorage.getItem("role")
            });
        }
    }, []);

    const login = ({ accessToken, refreshToken, user }) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("email", user.email);
        localStorage.setItem("name", user.name);
        localStorage.setItem("lastname", user.lastname);
        localStorage.setItem("role", user.role || "USER");

        setUser({
            id: user.id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role || "USER"
        });
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);