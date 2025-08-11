import type { TimesheetData } from '@/types/timesheet'
import dummyBranchList from '../common/branch/dummyBranchList';
import dummyUser from '../common/user/dummyUser';

const dummyTimesheetData: TimesheetData[] = [
  {
    branch: {
      id: dummyBranchList[0].id,
      name: dummyBranchList[0].name,
      operational: dummyBranchList[0].operational
    }, 
    employee: [
      dummyUser[0],
      dummyUser[1],
      dummyUser[2],
      dummyUser[3],
      dummyUser[4],
    ]
  },
  {    
    branch: {
      id: dummyBranchList[1].id,
      name: dummyBranchList[1].name,
      operational: dummyBranchList[1].operational
    }, 
    employee: [
      dummyUser[5],
      dummyUser[6],
      dummyUser[7],
      dummyUser[8],
      dummyUser[9],
    ]
  },
  {    
    branch: {
      id: dummyBranchList[2].id,
      name: dummyBranchList[2].name,
      operational: dummyBranchList[2].operational
    }, 
    employee: [
      dummyUser[10],
      dummyUser[11],
      dummyUser[12],
      dummyUser[13],
      dummyUser[14],
    ]
  },
  {    
    branch: {
      id: dummyBranchList[3].id,
      name: dummyBranchList[3].name,
      operational: dummyBranchList[3].operational
    }, 
    employee: [
      dummyUser[15],
      dummyUser[16],
      dummyUser[17],
      dummyUser[18],
      dummyUser[19],
      dummyUser[20],
    ]
  }
]

export default dummyTimesheetData;