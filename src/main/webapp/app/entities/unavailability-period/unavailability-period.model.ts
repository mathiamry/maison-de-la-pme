import * as dayjs from 'dayjs';
import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { IPartnerRepresentative } from 'app/entities/partner-representative/partner-representative.model';

export interface IUnavailabilityPeriod {
  id?: number;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  advisors?: IAdvisor[] | null;
  partnerRepresentatives?: IPartnerRepresentative[] | null;
}

export class UnavailabilityPeriod implements IUnavailabilityPeriod {
  constructor(
    public id?: number,
    public startTime?: dayjs.Dayjs | null,
    public endTime?: dayjs.Dayjs | null,
    public advisors?: IAdvisor[] | null,
    public partnerRepresentatives?: IPartnerRepresentative[] | null
  ) {}
}

export function getUnavailabilityPeriodIdentifier(unavailabilityPeriod: IUnavailabilityPeriod): number | undefined {
  return unavailabilityPeriod.id;
}
