import type { Branch } from '@/types/branch'
import api from '../../api'
import dummyBranchList from './dummyBranchList'

export async function fetchBranches(): Promise<Branch[]> {
  try {
    const res = await api.get('/branches?is_active=true');

    return res.data;
  } catch (error) {
    console.warn(`Fetch branches in failed, using dummy.`, error);

    return dummyBranchList.filter(branch => branch.operational.is_active === true);
  }
}