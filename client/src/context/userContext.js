import { createContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({children}) {

  const [user, setUser] = useState({
    userId: "",
    username: "",
    authenticated: false
  })

  const updateUser = (name, value) => {
    setUser((prevUser) => ({ ...prevUser, [name]: value }))
  }
  
  return(
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;