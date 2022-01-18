import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'turnover',
        data: { pageTitle: 'maisondelapmeApp.turnover.home.title' },
        loadChildren: () => import('./turnover/turnover.module').then(m => m.TurnoverModule),
      },
      {
        path: 'language',
        data: { pageTitle: 'maisondelapmeApp.language.home.title' },
        loadChildren: () => import('./language/language.module').then(m => m.LanguageModule),
      },
      {
        path: 'frequently-asked-question',
        data: { pageTitle: 'maisondelapmeApp.frequentlyAskedQuestion.home.title' },
        loadChildren: () =>
          import('./frequently-asked-question/frequently-asked-question.module').then(m => m.FrequentlyAskedQuestionModule),
      },
      {
        path: 'notification',
        data: { pageTitle: 'maisondelapmeApp.notification.home.title' },
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
      },
      {
        path: 'history',
        data: { pageTitle: 'maisondelapmeApp.history.home.title' },
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
      },
      {
        path: 'size',
        data: { pageTitle: 'maisondelapmeApp.size.home.title' },
        loadChildren: () => import('./size/size.module').then(m => m.SizeModule),
      },
      {
        path: 'experience',
        data: { pageTitle: 'maisondelapmeApp.experience.home.title' },
        loadChildren: () => import('./experience/experience.module').then(m => m.ExperienceModule),
      },
      {
        path: 'bank',
        data: { pageTitle: 'maisondelapmeApp.bank.home.title' },
        loadChildren: () => import('./bank/bank.module').then(m => m.BankModule),
      },
      {
        path: 'country',
        data: { pageTitle: 'maisondelapmeApp.country.home.title' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'activity-area',
        data: { pageTitle: 'maisondelapmeApp.activityArea.home.title' },
        loadChildren: () => import('./activity-area/activity-area.module').then(m => m.ActivityAreaModule),
      },
      {
        path: 'need',
        data: { pageTitle: 'maisondelapmeApp.need.home.title' },
        loadChildren: () => import('./need/need.module').then(m => m.NeedModule),
      },
      {
        path: 'sme-house',
        data: { pageTitle: 'maisondelapmeApp.sMEHouse.home.title' },
        loadChildren: () => import('./sme-house/sme-house.module').then(m => m.SMEHouseModule),
      },
      {
        path: 'sme',
        data: { pageTitle: 'maisondelapmeApp.sme.home.title' },
        loadChildren: () => import('./sme/sme.module').then(m => m.SmeModule),
      },
      {
        path: 'sme-representative',
        data: { pageTitle: 'maisondelapmeApp.smeRepresentative.home.title' },
        loadChildren: () => import('./sme-representative/sme-representative.module').then(m => m.SmeRepresentativeModule),
      },
      {
        path: 'unavailability-period',
        data: { pageTitle: 'maisondelapmeApp.unavailabilityPeriod.home.title' },
        loadChildren: () => import('./unavailability-period/unavailability-period.module').then(m => m.UnavailabilityPeriodModule),
      },
      {
        path: 'availability-timeslot',
        data: { pageTitle: 'maisondelapmeApp.availabilityTimeslot.home.title' },
        loadChildren: () => import('./availability-timeslot/availability-timeslot.module').then(m => m.AvailabilityTimeslotModule),
      },
      {
        path: 'anonymous',
        data: { pageTitle: 'maisondelapmeApp.anonymous.home.title' },
        loadChildren: () => import('./anonymous/anonymous.module').then(m => m.AnonymousModule),
      },
      {
        path: 'partner',
        data: { pageTitle: 'maisondelapmeApp.partner.home.title' },
        loadChildren: () => import('./partner/partner.module').then(m => m.PartnerModule),
      },
      {
        path: 'partner-representative',
        data: { pageTitle: 'maisondelapmeApp.partnerRepresentative.home.title' },
        loadChildren: () => import('./partner-representative/partner-representative.module').then(m => m.PartnerRepresentativeModule),
      },
      {
        path: 'advisor',
        data: { pageTitle: 'maisondelapmeApp.advisor.home.title' },
        loadChildren: () => import('./advisor/advisor.module').then(m => m.AdvisorModule),
      },
      {
        path: 'appointment',
        data: { pageTitle: 'maisondelapmeApp.appointment.home.title' },
        loadChildren: () => import('./appointment/appointment.module').then(m => m.AppointmentModule),
      },
      {
        path: 'news',
        data: { pageTitle: 'maisondelapmeApp.news.home.title' },
        loadChildren: () => import('./news/news.module').then(m => m.NewsModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'maisondelapmeApp.event.home.title' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'administrator',
        data: { pageTitle: 'maisondelapmeApp.administrator.home.title' },
        loadChildren: () => import('./administrator/administrator.module').then(m => m.AdministratorModule),
      },
      {
        path: 'tender',
        data: { pageTitle: 'maisondelapmeApp.tender.home.title' },
        loadChildren: () => import('./tender/tender.module').then(m => m.TenderModule),
      },
      {
        path: 'file',
        data: { pageTitle: 'maisondelapmeApp.file.home.title' },
        loadChildren: () => import('./file/file.module').then(m => m.FileModule),
      },
      {
        path: 'person',
        data: { pageTitle: 'maisondelapmeApp.person.home.title' },
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
      },
      {
        path: 'appointment-object',
        data: { pageTitle: 'maisondelapmeApp.appointmentObject.home.title' },
        loadChildren: () => import('./appointment-object/appointment-object.module').then(m => m.AppointmentObjectModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
