import type { TimesheetData } from '@/types/timesheet'
import dummyBranchList from '../common/branch/dummyBranchList';
import dummyEmployee from '../common/employee/dummyEmployee';

const dummyTimesheetData: TimesheetData[] = [
  {
    branch: {
      id: dummyBranchList[0].id,
      name: dummyBranchList[0].name,
      operational: dummyBranchList[0].operational
    }, 
    employee: [
      dummyEmployee[0],
      dummyEmployee[1],
      dummyEmployee[2],
      dummyEmployee[3],
      dummyEmployee[4],
    ]
  },
  {    
    branch: {
      id: dummyBranchList[1].id,
      name: dummyBranchList[1].name,
      operational: dummyBranchList[1].operational
    }, 
    employee: [
      dummyEmployee[5],
      dummyEmployee[6],
      dummyEmployee[7],
      dummyEmployee[8],
      dummyEmployee[9],
    ]
  },
  {    
    branch: {
      id: dummyBranchList[2].id,
      name: dummyBranchList[2].name,
      operational: dummyBranchList[2].operational
    }, 
    employee: [
      dummyEmployee[10],
      dummyEmployee[11],
      dummyEmployee[12],
      dummyEmployee[13],
      dummyEmployee[14],
    ]
  },
  {    
    branch: {
      id: dummyBranchList[3].id,
      name: dummyBranchList[3].name,
      operational: dummyBranchList[3].operational
    }, 
    employee: [
      dummyEmployee[15],
      dummyEmployee[16],
      dummyEmployee[17],
      dummyEmployee[18],
      dummyEmployee[19],
      dummyEmployee[20],
    ]
  }
]

export default dummyTimesheetData;