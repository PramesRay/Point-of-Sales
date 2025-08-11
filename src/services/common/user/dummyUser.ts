import dummyBranchList from "../branch/dummyBranchList";
import type { User } from "@/types/user";

const dummyUser: User[] = [
  {
    id: '6206b9a0-3c7d-4a04-9da6-6c9e9a0b1a6c',
    name: 'Prames',
    phone: '6282299958474',
    branch: dummyBranchList[0],
    meta: {
      created_at: new Date(),
      updated_at: new Date(),
    }
  },
  {
    id: '5a6a2f2e-3f4b-45b3-92f1-6ebd9c7f1c9c',
    name: 'Hermanu',
    phone: '6281234567890',
    branch: dummyBranchList[1],
    meta: {
      created_at: new Date(),
      updated_at: new Date(),
    }
  },
  {
    id: '3e2b4c2e-5f2c-4d3a-8e4a-3a3b2c3d4e5f',
    name: 'Siti',
    phone: '6289876543210',
    branch: dummyBranchList[2],
    meta: {
      created_at: new Date(),
      updated_at: new Date(),
    }
  },
  {
    id: '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b',
    name: 'Budi',
    phone: '6281122334455',
    branch: dummyBranchList[3],
    meta: {
      created_at: new Date(),
      updated_at: new Date(),
    }
  }

]

export default dummyUser