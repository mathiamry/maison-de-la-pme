import { IAppointment } from 'app/entities/appointment/appointment.model';

export interface IAppointmentObject {
  id?: number;
  object?: string;
  appointments?: IAppointment[] | null;
}

export class AppointmentObject implements IAppointmentObject {
  constructor(public id?: number, public object?: string, public appointments?: IAppointment[] | null) {}
}

export function getAppointmentObjectIdentifier(appointmentObject: IAppointmentObject): number | undefined {
  return appointmentObject.id;
}
