import React from 'react';

const AuthContext = React.createContext({
    signedIn: false,
    setSignedIn: (auth) => {},
    loggedIn: false,
    setIsLoggedIn: (auth) => {}
})

export default AuthContext;
