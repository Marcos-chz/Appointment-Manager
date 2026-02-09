import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const getUserIdFromToken = () => {
  const user = getUserFromToken();
  return user?.userId ?? null;
};

export const getRoleFromToken = () =>{
    const user = getUserFromToken()
    return user?.role ?? null
}
export const logout = () => {
  localStorage.removeItem("token");
};
