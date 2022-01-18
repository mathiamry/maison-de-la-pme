package com.baamtu.mdpme.domain;

import com.baamtu.mdpme.domain.enumeration.AppointmentLocation;
import com.baamtu.mdpme.domain.enumeration.Status;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Appointment.
 */
@Entity
@Table(name = "appointment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Appointment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "location", nullable = false)
    private AppointmentLocation location;

    @Column(name = "rate")
    private Integer rate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "internalUser", "person", "sme", "appointments" }, allowSetters = true)
    private SmeRepresentative smeRepresentative;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "internalUser", "person", "smeHouse", "appointmnents", "availabilityTimeslots", "unavailabilityPeriods" },
        allowSetters = true
    )
    private Advisor advisor;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "internalUser", "person", "partner", "appointmnents", "availabilityTimeslots", "unavailabilityPeriods" },
        allowSetters = true
    )
    private PartnerRepresentative partnerRepresentative;

    @OneToMany(mappedBy = "object")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "object" }, allowSetters = true)
    private Set<AppointmentObject> appointments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Appointment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Appointment title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Appointment description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public Appointment startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return this.endDate;
    }

    public Appointment endDate(Instant endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public Status getStatus() {
        return this.status;
    }

    public Appointment status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public AppointmentLocation getLocation() {
        return this.location;
    }

    public Appointment location(AppointmentLocation location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(AppointmentLocation location) {
        this.location = location;
    }

    public Integer getRate() {
        return this.rate;
    }

    public Appointment rate(Integer rate) {
        this.setRate(rate);
        return this;
    }

    public void setRate(Integer rate) {
        this.rate = rate;
    }

    public SmeRepresentative getSmeRepresentative() {
        return this.smeRepresentative;
    }

    public void setSmeRepresentative(SmeRepresentative smeRepresentative) {
        this.smeRepresentative = smeRepresentative;
    }

    public Appointment smeRepresentative(SmeRepresentative smeRepresentative) {
        this.setSmeRepresentative(smeRepresentative);
        return this;
    }

    public Advisor getAdvisor() {
        return this.advisor;
    }

    public void setAdvisor(Advisor advisor) {
        this.advisor = advisor;
    }

    public Appointment advisor(Advisor advisor) {
        this.setAdvisor(advisor);
        return this;
    }

    public PartnerRepresentative getPartnerRepresentative() {
        return this.partnerRepresentative;
    }

    public void setPartnerRepresentative(PartnerRepresentative partnerRepresentative) {
        this.partnerRepresentative = partnerRepresentative;
    }

    public Appointment partnerRepresentative(PartnerRepresentative partnerRepresentative) {
        this.setPartnerRepresentative(partnerRepresentative);
        return this;
    }

    public Set<AppointmentObject> getAppointments() {
        return this.appointments;
    }

    public void setAppointments(Set<AppointmentObject> appointmentObjects) {
        if (this.appointments != null) {
            this.appointments.forEach(i -> i.setObject(null));
        }
        if (appointmentObjects != null) {
            appointmentObjects.forEach(i -> i.setObject(this));
        }
        this.appointments = appointmentObjects;
    }

    public Appointment appointments(Set<AppointmentObject> appointmentObjects) {
        this.setAppointments(appointmentObjects);
        return this;
    }

    public Appointment addAppointments(AppointmentObject appointmentObject) {
        this.appointments.add(appointmentObject);
        appointmentObject.setObject(this);
        return this;
    }

    public Appointment removeAppointments(AppointmentObject appointmentObject) {
        this.appointments.remove(appointmentObject);
        appointmentObject.setObject(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Appointment)) {
            return false;
        }
        return id != null && id.equals(((Appointment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Appointment{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", location='" + getLocation() + "'" +
            ", rate=" + getRate() +
            "}";
    }
}
