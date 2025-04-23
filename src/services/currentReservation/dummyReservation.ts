import type { Reservation } from '@/types/reservation'

const dummyReservationData: Record<string, Reservation[]> = {
  'branch-1': [
    {
      customer: { name: "Khodijah", phone: "08123456789" },
      date: new Date("2022-07-25"),
      time: "18:00",
      status: "Pending",
      people: 4
    },
    {
      customer: { name: "Ahmad", phone: "081987654321" },
      date: new Date("2022-07-26"),
      time: "19:30",
      status: "Pending",
      people: 2
    },
    {
      customer: { name: "Siti", phone: "081212121212" },
      date: new Date("2022-07-27"),
      time: "20:00",
      status: "Pending",
      people: 3
    },
    {
      customer: { name: "Budi", phone: "081313131313" },
      date: new Date("2022-07-28"),
      time: "18:30",
      status: "Disetujui",
      people: 5
    },
    {
      customer: { name: "Rina", phone: "081414141414" },
      date: new Date("2022-07-29"),
      time: "19:00",
      status: "Ditolak",
      people: 4
    }
  ],
  'branch-2': [
    {
      customer: { name: "Dewi", phone: "082222222222" },
      date: new Date("2022-07-30"),
      time: "18:00",
      status: "Pending",
      people: 3
    },
    {
      customer: { name: "Fajar", phone: "083333333333" },
      date: new Date("2022-07-31"),
      time: "19:00",
      status: "Pending",
      people: 2
    },
    {
      customer: { name: "Gita", phone: "084444444444" },
      date: new Date("2022-08-01"),
      time: "20:00",
      status: "Disetujui",
      people: 4
    },
    {
      customer: { name: "Hendra", phone: "085555555555" },
      date: new Date("2022-08-02"),
      time: "18:30",
      status: "Ditolak",
      people: 5
    },
    {
      customer: { name: "Indah", phone: "086666666666" },
      date: new Date("2022-08-03"),
      time: "19:30",
      status: "Pending",
      people: 2
    }
  ],
  'branch-3': [
    {
      customer: { name: "Joko", phone: "087777777777" },
      date: new Date("2022-08-04"),
      time: "18:00",
      status: "Pending",
      people: 2
    },
    {
      customer: { name: "Kiki", phone: "088888888888" },
      date: new Date("2022-08-05"),
      time: "19:00",
      status: "Disetujui",
      people: 4
    },
    {
      customer: { name: "Lina", phone: "089999999999" },
      date: new Date("2022-08-06"),
      time: "20:00",
      status: "Ditolak",
      people: 3
    },
    {
      customer: { name: "Maman", phone: "080000000000" },
      date: new Date("2022-08-07"),
      time: "18:30",
      status: "Pending",
      people: 5
    },
    {
      customer: { name: "Nina", phone: "081111111111" },
      date: new Date("2022-08-08"),
      time: "19:30",
      status: "Disetujui",
      people: 4
    }
  ],
  'branch-4': [
    {
      customer: { name: "Oki", phone: "082121212121" },
      date: new Date("2022-08-09"),
      time: "18:00",
      status: "Ditolak",
      people: 3
    },
    {
      customer: { name: "Putri", phone: "083232323232" },
      date: new Date("2022-08-10"),
      time: "19:00",
      status: "Pending",
      people: 4
    },
    {
      customer: { name: "Qori", phone: "084343434343" },
      date: new Date("2022-08-11"),
      time: "20:00",
      status: "Disetujui",
      people: 2
    },
    {
      customer: { name: "Rama", phone: "085454545454" },
      date: new Date("2022-08-12"),
      time: "18:30",
      status: "Pending",
      people: 5
    },
    {
      customer: { name: "Salsa", phone: "086565656565" },
      date: new Date("2022-08-13"),
      time: "19:30",
      status: "Ditolak",
      people: 3
    }
  ]
}

export default dummyReservationData
