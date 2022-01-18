package com.baamtu.mdpme.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PartnerRepresentative.
 */
@Entity
@Table(name = "partner_representative")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PartnerRepresentative implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "description")
    private String description;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User internalUser;

    @JsonIgnoreProperties(value = { "language" }, allowSetters = true)
    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Person person;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "smeHouse", "representings" }, allowSetters = true)
    private Partner partner;

    @OneToMany(mappedBy = "partnerRepresentative")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "smeRepresentative", "advisor", "partnerRepresentative", "object" }, allowSetters = true)
    private Set<Appointment> appointmnents = new HashSet<>();

    @ManyToMany(mappedBy = "partnerRepresentatives")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "advisors", "partnerRepresentatives" }, allowSetters = true)
    private Set<AvailabilityTimeslot> availabilityTimeslots = new HashSet<>();

    @ManyToMany(mappedBy = "partnerRepresentatives")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "advisors", "partnerRepresentatives" }, allowSetters = true)
    private Set<UnavailabilityPeriod> unavailabilityPeriods = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PartnerRepresentative id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public PartnerRepresentative jobTitle(String jobTitle) {
        this.setJobTitle(jobTitle);
        return this;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getDescription() {
        return this.description;
    }

    public PartnerRepresentative description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public PartnerRepresentative internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Person getPerson() {
        return this.person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public PartnerRepresentative person(Person person) {
        this.setPerson(person);
        return this;
    }

    public Partner getPartner() {
        return this.partner;
    }

    public void setPartner(Partner partner) {
        this.partner = partner;
    }

    public PartnerRepresentative partner(Partner partner) {
        this.setPartner(partner);
        return this;
    }

    public Set<Appointment> getAppointmnents() {
        return this.appointmnents;
    }

    public void setAppointmnents(Set<Appointment> appointments) {
        if (this.appointmnents != null) {
            this.appointmnents.forEach(i -> i.setPartnerRepresentative(null));
        }
        if (appointments != null) {
            appointments.forEach(i -> i.setPartnerRepresentative(this));
        }
        this.appointmnents = appointments;
    }

    public PartnerRepresentative appointmnents(Set<Appointment> appointments) {
        this.setAppointmnents(appointments);
        return this;
    }

    public PartnerRepresentative addAppointmnents(Appointment appointment) {
        this.appointmnents.add(appointment);
        appointment.setPartnerRepresentative(this);
        return this;
    }

    public PartnerRepresentative removeAppointmnents(Appointment appointment) {
        this.appointmnents.remove(appointment);
        appointment.setPartnerRepresentative(null);
        return this;
    }

    public Set<AvailabilityTimeslot> getAvailabilityTimeslots() {
        return this.availabilityTimeslots;
    }

    public void setAvailabilityTimeslots(Set<AvailabilityTimeslot> availabilityTimeslots) {
        if (this.availabilityTimeslots != null) {
            this.availabilityTimeslots.forEach(i -> i.removePartnerRepresentative(this));
        }
        if (availabilityTimeslots != null) {
            availabilityTimeslots.forEach(i -> i.addPartnerRepresentative(this));
        }
        this.availabilityTimeslots = availabilityTimeslots;
    }

    public PartnerRepresentative availabilityTimeslots(Set<AvailabilityTimeslot> availabilityTimeslots) {
        this.setAvailabilityTimeslots(availabilityTimeslots);
        return this;
    }

    public PartnerRepresentative addAvailabilityTimeslot(AvailabilityTimeslot availabilityTimeslot) {
        this.availabilityTimeslots.add(availabilityTimeslot);
        availabilityTimeslot.getPartnerRepresentatives().add(this);
        return this;
    }

    public PartnerRepresentative removeAvailabilityTimeslot(AvailabilityTimeslot availabilityTimeslot) {
        this.availabilityTimeslots.remove(availabilityTimeslot);
        availabilityTimeslot.getPartnerRepresentatives().remove(this);
        return this;
    }

    public Set<UnavailabilityPeriod> getUnavailabilityPeriods() {
        return this.unavailabilityPeriods;
    }

    public void setUnavailabilityPeriods(Set<UnavailabilityPeriod> unavailabilityPeriods) {
        if (this.unavailabilityPeriods != null) {
            this.unavailabilityPeriods.forEach(i -> i.removePartnerRepresentative(this));
        }
        if (unavailabilityPeriods != null) {
            unavailabilityPeriods.forEach(i -> i.addPartnerRepresentative(this));
        }
        this.unavailabilityPeriods = unavailabilityPeriods;
    }

    public PartnerRepresentative unavailabilityPeriods(Set<UnavailabilityPeriod> unavailabilityPeriods) {
        this.setUnavailabilityPeriods(unavailabilityPeriods);
        return this;
    }

    public PartnerRepresentative addUnavailabilityPeriod(UnavailabilityPeriod unavailabilityPeriod) {
        this.unavailabilityPeriods.add(unavailabilityPeriod);
        unavailabilityPeriod.getPartnerRepresentatives().add(this);
        return this;
    }

    public PartnerRepresentative removeUnavailabilityPeriod(UnavailabilityPeriod unavailabilityPeriod) {
        this.unavailabilityPeriods.remove(unavailabilityPeriod);
        unavailabilityPeriod.getPartnerRepresentatives().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PartnerRepresentative)) {
            return false;
        }
        return id != null && id.equals(((PartnerRepresentative) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PartnerRepresentative{" +
            "id=" + getId() +
            ", jobTitle='" + getJobTitle() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
