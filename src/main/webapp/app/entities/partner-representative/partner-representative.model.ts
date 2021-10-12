import { IUser } from 'app/entities/user/user.model';
import { IPerson } from 'app/entities/person/person.model';
import { IPartner } from 'app/entities/partner/partner.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { IAvailabilityTimeslot } from 'app/entities/availability-timeslot/availability-timeslot.model';
import { IUnavailabilityPeriod } from 'app/entities/unavailability-period/unavailability-period.model';

export interface IPartnerRepresentative {
  id?: number;
  jobTitle?: string | null;
  description?: string | null;
  internalUser?: IUser;
  person?: IPerson;
  partner?: IPartner;
  appointmnents?: IAppointment[] | null;
  availabilityTimeslots?: IAvailabilityTimeslot[] | null;
  unavailabilityPeriods?: IUnavailabilityPeriod[] | null;
}

export class PartnerRepresentative implements IPartnerRepresentative {
  constructor(
    public id?: number,
    public jobTitle?: string | null,
    public description?: string | null,
    public internalUser?: IUser,
    public person?: IPerson,
    public partner?: IPartner,
    public appointmnents?: IAppointment[] | null,
    public availabilityTimeslots?: IAvailabilityTimeslot[] | null,
    public unavailabilityPeriods?: IUnavailabilityPeriod[] | null
  ) {}
}

export function getPartnerRepresentativeIdentifier(partnerRepresentative: IPartnerRepresentative): number | undefined {
  return partnerRepresentative.id;
}
