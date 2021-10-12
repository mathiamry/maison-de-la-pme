import * as dayjs from 'dayjs';
import { ISmeRepresentative } from 'app/entities/sme-representative/sme-representative.model';
import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { IPartnerRepresentative } from 'app/entities/partner-representative/partner-representative.model';
import { Status } from 'app/entities/enumerations/status.model';
import { AppointmentLocation } from 'app/entities/enumerations/appointment-location.model';

export interface IAppointment {
  id?: number;
  title?: string;
  description?: string | null;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  status?: Status;
  location?: AppointmentLocation;
  rate?: number | null;
  smeRepresentative?: ISmeRepresentative | null;
  advisor?: IAdvisor | null;
  partnerRepresentative?: IPartnerRepresentative | null;
}

export class Appointment implements IAppointment {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string | null,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs,
    public status?: Status,
    public location?: AppointmentLocation,
    public rate?: number | null,
    public smeRepresentative?: ISmeRepresentative | null,
    public advisor?: IAdvisor | null,
    public partnerRepresentative?: IPartnerRepresentative | null
  ) {}
}

export function getAppointmentIdentifier(appointment: IAppointment): number | undefined {
  return appointment.id;
}
