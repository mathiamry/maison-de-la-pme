import { IUser } from 'app/entities/user/user.model';
import { IPerson } from 'app/entities/person/person.model';
import { ISMEHouse } from 'app/entities/sme-house/sme-house.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { IAvailabilityTimeslot } from 'app/entities/availability-timeslot/availability-timeslot.model';
import { IUnavailabilityPeriod } from 'app/entities/unavailability-period/unavailability-period.model';

export interface IAdvisor {
  id?: number;
  jobTitle?: string | null;
  description?: string | null;
  internalUser?: IUser;
  person?: IPerson;
  smeHouse?: ISMEHouse;
  appointmnents?: IAppointment[] | null;
  availabilityTimeslots?: IAvailabilityTimeslot[] | null;
  unavailabilityPeriods?: IUnavailabilityPeriod[] | null;
}

export class Advisor implements IAdvisor {
  constructor(
    public id?: number,
    public jobTitle?: string | null,
    public description?: string | null,
    public internalUser?: IUser,
    public person?: IPerson,
    public smeHouse?: ISMEHouse,
    public appointmnents?: IAppointment[] | null,
    public availabilityTimeslots?: IAvailabilityTimeslot[] | null,
    public unavailabilityPeriods?: IUnavailabilityPeriod[] | null
  ) {}
}

export function getAdvisorIdentifier(advisor: IAdvisor): number | undefined {
  return advisor.id;
}
