import logger from './log';
import requestService from './dynamodb/trrequest.service';

export default class TRRequest {
    constructor(public username: string = '',
        public realname: string = '',
        public eventname: string = '',
        public eventtype: TREvent = eventList[5], // "Other" event
        public description: string = '',
        public date: string = '',
        public time: string = '',
        public location: string = '',
        public gradeformat: string = '',
        public justification: string = '',
        public cost: number = 0,
        public projected: number = 0,
        public nexttoapprove: string = '',
        public approvalstatus: string = 'pending'
        ) { };
}

export interface TREvent {
    eventname: string,
    coverage: number
}

export const eventList: TREvent[] = [
    { eventname: 'University Course', coverage: 0.8 }, 
    { eventname: 'Seminar', coverage: 0.6 },
    { eventname: 'Certification Preparation Class', coverage: 0.75 },
    { eventname: 'Certification', coverage: 1 },
    { eventname: 'Technical Training', coverage: 0.9 },
    { eventname: 'Other', coverage: 0.3 }
];
