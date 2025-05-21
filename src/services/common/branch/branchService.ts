import type { Branch } from '@/types/branch'
import api from '../../api'
import dummyBranchList from './dummyBranchList'

export async function fetchBranchList(): Promise<Branch[]> {
  try {
    const response = await api.get<Branch[]>('/branches')
    return response.data
  } catch (error) {
    console.warn('Gagal fetch branch list, menggunakan dummy.', error)
    return dummyBranchList
  }
}