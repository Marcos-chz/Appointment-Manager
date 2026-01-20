import { jwtDecode } from "jwt-decode";

// Devuelve TODO el usuario del token
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

// userId
export const getUserIdFromToken = () => {
  const user = getUserFromToken();
  return user?.userId ?? null;
};

// role
export const getRoleFromToken = () =>{
    const user = getUserFromToken()
    return user?.role ?? null
}
// Logout
export const logout = () => {
  localStorage.removeItem("token");
};
