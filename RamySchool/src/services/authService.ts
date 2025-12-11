import api from "@/lib/api";

export const login = async (email:string,password:string) => {
  const res = await api.post("/auth/login", {email,password});
  console.log(res);
  return res.data;
};

