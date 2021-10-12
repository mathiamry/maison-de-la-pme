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
 * A Advisor.
 */
@Entity
@Table(name = "advisor")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Advisor implements Serializable {

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
    @JsonIgnoreProperties(value = { "country", "administrator", "advisors", "partners", "smes" }, allowSetters = true)
    private SMEHouse smeHouse;

    @OneToMany(mappedBy = "advisor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "smeRepresentative", "advisor", "partnerRepresentative" }, allowSetters = true)
    private Set<Appointment> appointmnents = new HashSet<>();

    @ManyToMany(mappedBy = "advisors")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "advisors", "partnerRepresentatives" }, allowSetters = true)
    private Set<AvailabilityTimeslot> availabilityTimeslots = new HashSet<>();

    @ManyToMany(mappedBy = "advisors")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "advisors", "partnerRepresentatives" }, allowSetters = true)
    private Set<UnavailabilityPeriod> unavailabilityPeriods = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Advisor id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public Advisor jobTitle(String jobTitle) {
        this.setJobTitle(jobTitle);
        return this;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getDescription() {
        return this.description;
    }

    public Advisor description(String description) {
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

    public Advisor internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Person getPerson() {
        return this.person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Advisor person(Person person) {
        this.setPerson(person);
        return this;
    }

    public SMEHouse getSmeHouse() {
        return this.smeHouse;
    }

    public void setSmeHouse(SMEHouse sMEHouse) {
        this.smeHouse = sMEHouse;
    }

    public Advisor smeHouse(SMEHouse sMEHouse) {
        this.setSmeHouse(sMEHouse);
        return this;
    }

    public Set<Appointment> getAppointmnents() {
        return this.appointmnents;
    }

    public void setAppointmnents(Set<Appointment> appointments) {
        if (this.appointmnents != null) {
            this.appointmnents.forEach(i -> i.setAdvisor(null));
        }
        if (appointments != null) {
            appointments.forEach(i -> i.setAdvisor(this));
        }
        this.appointmnents = appointments;
    }

    public Advisor appointmnents(Set<Appointment> appointments) {
        this.setAppointmnents(appointments);
        return this;
    }

    public Advisor addAppointmnents(Appointment appointment) {
        this.appointmnents.add(appointment);
        appointment.setAdvisor(this);
        return this;
    }

    public Advisor removeAppointmnents(Appointment appointment) {
        this.appointmnents.remove(appointment);
        appointment.setAdvisor(null);
        return this;
    }

    public Set<AvailabilityTimeslot> getAvailabilityTimeslots() {
        return this.availabilityTimeslots;
    }

    public void setAvailabilityTimeslots(Set<AvailabilityTimeslot> availabilityTimeslots) {
        if (this.availabilityTimeslots != null) {
            this.availabilityTimeslots.forEach(i -> i.removeAdvisor(this));
        }
        if (availabilityTimeslots != null) {
            availabilityTimeslots.forEach(i -> i.addAdvisor(this));
        }
        this.availabilityTimeslots = availabilityTimeslots;
    }

    public Advisor availabilityTimeslots(Set<AvailabilityTimeslot> availabilityTimeslots) {
        this.setAvailabilityTimeslots(availabilityTimeslots);
        return this;
    }

    public Advisor addAvailabilityTimeslot(AvailabilityTimeslot availabilityTimeslot) {
        this.availabilityTimeslots.add(availabilityTimeslot);
        availabilityTimeslot.getAdvisors().add(this);
        return this;
    }

    public Advisor removeAvailabilityTimeslot(AvailabilityTimeslot availabilityTimeslot) {
        this.availabilityTimeslots.remove(availabilityTimeslot);
        availabilityTimeslot.getAdvisors().remove(this);
        return this;
    }

    public Set<UnavailabilityPeriod> getUnavailabilityPeriods() {
        return this.unavailabilityPeriods;
    }

    public void setUnavailabilityPeriods(Set<UnavailabilityPeriod> unavailabilityPeriods) {
        if (this.unavailabilityPeriods != null) {
            this.unavailabilityPeriods.forEach(i -> i.removeAdvisor(this));
        }
        if (unavailabilityPeriods != null) {
            unavailabilityPeriods.forEach(i -> i.addAdvisor(this));
        }
        this.unavailabilityPeriods = unavailabilityPeriods;
    }

    public Advisor unavailabilityPeriods(Set<UnavailabilityPeriod> unavailabilityPeriods) {
        this.setUnavailabilityPeriods(unavailabilityPeriods);
        return this;
    }

    public Advisor addUnavailabilityPeriod(UnavailabilityPeriod unavailabilityPeriod) {
        this.unavailabilityPeriods.add(unavailabilityPeriod);
        unavailabilityPeriod.getAdvisors().add(this);
        return this;
    }

    public Advisor removeUnavailabilityPeriod(UnavailabilityPeriod unavailabilityPeriod) {
        this.unavailabilityPeriods.remove(unavailabilityPeriod);
        unavailabilityPeriod.getAdvisors().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Advisor)) {
            return false;
        }
        return id != null && id.equals(((Advisor) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Advisor{" +
            "id=" + getId() +
            ", jobTitle='" + getJobTitle() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
