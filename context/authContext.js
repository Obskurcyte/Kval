import React from 'react';

const AuthContext = React.createContext({
    signedIn: false,
    setSignedIn: (auth) => {}
})

export default AuthContext;
