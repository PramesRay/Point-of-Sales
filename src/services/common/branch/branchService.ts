import type { Branch } from '@/types/branch'
import api from '../../api'

export async function fetchBranches(): Promise<Branch[]> {
  try {
    const res = await api.get('/branch?is_active=true');
    return res.data.data;
  } catch (error) {
    console.warn(`Fetch branches in failed, using dummy.`, error);
    return []
  }
}