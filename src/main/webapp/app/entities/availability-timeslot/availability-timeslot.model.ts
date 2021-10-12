import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { IPartnerRepresentative } from 'app/entities/partner-representative/partner-representative.model';
import { Day } from 'app/entities/enumerations/day.model';

export interface IAvailabilityTimeslot {
  id?: number;
  startHour?: number;
  startMin?: number;
  endHour?: number;
  endMin?: number;
  day?: Day;
  advisors?: IAdvisor[] | null;
  partnerRepresentatives?: IPartnerRepresentative[] | null;
}

export class AvailabilityTimeslot implements IAvailabilityTimeslot {
  constructor(
    public id?: number,
    public startHour?: number,
    public startMin?: number,
    public endHour?: number,
    public endMin?: number,
    public day?: Day,
    public advisors?: IAdvisor[] | null,
    public partnerRepresentatives?: IPartnerRepresentative[] | null
  ) {}
}

export function getAvailabilityTimeslotIdentifier(availabilityTimeslot: IAvailabilityTimeslot): number | undefined {
  return availabilityTimeslot.id;
}
