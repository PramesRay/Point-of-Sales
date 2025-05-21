import api from "@/services/api";
import { dummyUser } from "./dummyUser";

export async function fetchUser() {
  try {
    const res = await api.get('/api/me');
    return res.data
  } catch (error) {
    console.warn('Gagal fetch user, menggunakan dummy.', error);
    return dummyUser
  }
}