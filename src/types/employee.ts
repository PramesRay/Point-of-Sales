export type Employee = {
  id: string
  name: string
  email?: string
  role?: string
  access?: string[]
  last_active?: Date
  status?: 'aktif' | 'offline'
}