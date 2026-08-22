import type {
  BreakdownItem,
  DayBar,
  JobSettlement,
  JobTypeData,
  NetPayoutData,
  TechnicianEarning,
} from '@/src/types/earnings';

export const MOCK_NET_PAYOUT_WEEK: NetPayoutData = {
  label: 'NET PAYOUT · THIS WEEK',
  settlementStatus: 'pending',
  netPayout: 80492,
  grossRevenue: 96240,
  nextPayoutLabel: 'Fri, 20 Jun',
};

export const MOCK_NET_PAYOUT_MONTH: NetPayoutData = {
  label: 'NET PAYOUT · THIS MONTH',
  settlementStatus: 'inProgress',
  netPayout: 304980,
  grossRevenue: 384600,
  nextPayoutLabel: '1 Jul',
};

export const MOCK_BREAKDOWN_WEEK: BreakdownItem[] = [
  { id: 'revenue', icon: 'rupee',    label: 'Total revenue',         sublabel: 'Gross customer payments',   amount:  96240, variant: 'neutral'   },
  { id: 'fee',     icon: 'percent',  label: 'Platform fee (20%)',     sublabel: "Zepnest's share",           amount: -19248, variant: 'deduction' },
  { id: 'mrg',     icon: 'trending', label: 'MRG top-up received',   sublabel: 'Minimum Revenue Guarantee', amount:   3500, variant: 'addition'  },
  { id: 'mrgRec',  icon: 'refresh',  label: 'MRG recovery deducted', sublabel: 'Recovering earlier top-ups', amount:     0, variant: 'neutral'   },
];

export const MOCK_BREAKDOWN_MONTH: BreakdownItem[] = [
  { id: 'revenue', icon: 'rupee',    label: 'Total revenue',         sublabel: 'Gross customer payments',   amount:  384600, variant: 'neutral'   },
  { id: 'fee',     icon: 'percent',  label: 'Platform fee (20%)',     sublabel: "Zepnest's share",           amount:  -76920, variant: 'deduction' },
  { id: 'mrg',     icon: 'trending', label: 'MRG top-up received',   sublabel: 'Minimum Revenue Guarantee', amount:    3500, variant: 'addition'  },
  { id: 'mrgRec',  icon: 'refresh',  label: 'MRG recovery deducted', sublabel: 'Recovering earlier top-ups', amount:  -6200, variant: 'deduction' },
];

export const MOCK_WEEK_BARS: DayBar[] = [
  { day: 'Mon', amount: 12000, isToday: false },
  { day: 'Tue', amount: 16000, isToday: false },
  { day: 'Wed', amount: 14000, isToday: false },
  { day: 'Thu', amount: 20000, isToday: false },
  { day: 'Fri', amount: 18000, isToday: false },
  { day: 'Sat', amount: 21000, isToday: false },
  { day: 'Sun', amount: 10000, isToday: true  },
];

export const MOCK_JOB_TYPES: JobTypeData[] = [
  { key: 'rateCard',   label: 'Rate Card',   typeLabel: 'Type 1', percent: 32, amount: 31200 },
  { key: 'service',    label: 'Service',     typeLabel: 'Type 2', percent: 45, amount: 42840 },
  { key: 'highTicket', label: 'High Ticket', typeLabel: 'Type 3', percent: 23, amount: 22200 },
];

export const MOCK_TECHNICIAN_EARNINGS: TechnicianEarning[] = [
  { id: 'rk', initials: 'RK', avatarColor: 'blue',   name: 'Ravi Kumar', specialties: 'Electrical · Plumbing',    jobsDone: 11, percent: 23, grossAmount: 21800, netAmount: 17440, platformFee: 4360, avgPerJob: 1982 },
  { id: 'iq', initials: 'IQ', avatarColor: 'teal',   name: 'Imran Q.',   specialties: 'AC Repair · Appliances',   jobsDone: 10, percent: 20, grossAmount: 19600, netAmount: 15680, platformFee: 3920, avgPerJob: 1960 },
  { id: 'as', initials: 'AS', avatarColor: 'amber',  name: 'Anita Shah', specialties: 'AC Repair · Appliances',   jobsDone:  9, percent: 19, grossAmount: 18420, netAmount: 14736, platformFee: 3684, avgPerJob: 2047 },
  { id: 'dn', initials: 'DN', avatarColor: 'purple', name: 'Deepa N.',   specialties: 'Plumbing · Appliances',    jobsDone:  7, percent: 17, grossAmount: 16200, netAmount: 12960, platformFee: 3240, avgPerJob: 2314 },
  { id: 'sr', initials: 'SR', avatarColor: 'green',  name: 'Sunil Rao',  specialties: 'Electrical · Fan fitting', jobsDone:  6, percent: 13, grossAmount: 12420, netAmount:  9936, platformFee: 2484, avgPerJob: 2070 },
  { id: 'fa', initials: 'FA', avatarColor: 'red',    name: 'Farhan A.',  specialties: 'Plumbing · Waterproofing', jobsDone:  4, percent:  8, grossAmount:  7800, netAmount:  6240, platformFee: 1560, avgPerJob: 1950 },
];

export const MOCK_JOB_SETTLEMENTS: JobSettlement[] = [
  { id: 'j1', jobTypeKey: 'service',    jobTypeLabel: 'TYPE 2 · Service',     name: 'Washing machine install',      jobNumber: '#ZN-48188', date: '15 Jun', time: '11:51 AM', netAmount:   680, grossAmount:   850, platformFee:   170, technicianName: 'Imran Q.',   paymentMethod: 'UPI QR' },
  { id: 'j2', jobTypeKey: 'rateCard',   jobTypeLabel: 'TYPE 1 · Rate Card',   name: '60-min Plumbing',              jobNumber: '#ZN-48172', date: '15 Jun', time: '10:52 AM', netAmount:   576, grossAmount:   720, platformFee:   144, technicianName: 'Ravi Kumar', paymentMethod: 'Cash'   },
  { id: 'j3', jobTypeKey: 'service',    jobTypeLabel: 'TYPE 2 · Service',     name: 'AC Gas Refill + Deep Clean',   jobNumber: '#ZN-48160', date: '15 Jun', time: '10:24 AM', netAmount:  1199, grossAmount:  1499, platformFee:   300, technicianName: 'Anita Shah', paymentMethod: 'UPI QR' },
  { id: 'j4', jobTypeKey: 'rateCard',   jobTypeLabel: 'TYPE 1 · Rate Card',   name: 'Fan & light fitting',          jobNumber: '#ZN-48155', date: '15 Jun', time: '9:48 AM',  netAmount:   600, grossAmount:   750, platformFee:   150, technicianName: 'Deepa N.',   paymentMethod: 'Cash'   },
  { id: 'j5', jobTypeKey: 'highTicket', jobTypeLabel: 'TYPE 3 · High Ticket', name: 'Water-proofing – high ticket', jobNumber: '#ZN-48142', date: '14 Jun', time: '5:10 PM',  netAmount:  6720, grossAmount:  8400, platformFee:  1680, technicianName: 'Sunil Rao',  paymentMethod: 'UPI QR' },
  { id: 'j6', jobTypeKey: 'rateCard',   jobTypeLabel: 'TYPE 1 · Rate Card',   name: 'Refrigerator repair',          jobNumber: '#ZN-48131', date: '14 Jun', time: '2:30 PM',  netAmount:   944, grossAmount:  1180, platformFee:   236, technicianName: 'Ravi Kumar', paymentMethod: 'Cash'   },
  { id: 'j7', jobTypeKey: 'rateCard',   jobTypeLabel: 'TYPE 1 · Rate Card',   name: '90-min Electrical',            jobNumber: '#ZN-48118', date: '14 Jun', time: '12:05 PM', netAmount:  1000, grossAmount:  1250, platformFee:   250, technicianName: 'Farhan A.',  paymentMethod: 'UPI QR' },
  { id: 'j8', jobTypeKey: 'highTicket', jobTypeLabel: 'TYPE 3 · High Ticket', name: 'Modular kitchen install',      jobNumber: '#ZN-48104', date: '13 Jun', time: '6:40 PM',  netAmount: 10240, grossAmount: 12800, platformFee:  2560, technicianName: 'Anita Shah', paymentMethod: 'UPI QR' },
];
