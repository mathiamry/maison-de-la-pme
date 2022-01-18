import { IAppointment } from 'app/entities/appointment/appointment.model';

export interface IAppointmentObject {
  id?: number;
  object?: string;
  object?: IAppointment;
}

export class AppointmentObject implements IAppointmentObject {
  constructor(public id?: number, public object?: string, public object?: IAppointment) {}
}

export function getAppointmentObjectIdentifier(appointmentObject: IAppointmentObject): number | undefined {
  return appointmentObject.id;
}
