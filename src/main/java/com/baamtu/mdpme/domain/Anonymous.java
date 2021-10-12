package com.baamtu.mdpme.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Anonymous.
 */
@Entity
@Table(name = "anonymous")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Anonymous implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "visit_date", nullable = false)
    private Instant visitDate;

    @JsonIgnoreProperties(value = { "language" }, allowSetters = true)
    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Person person;

    @ManyToOne
    @JsonIgnoreProperties(value = { "smeRepresentative", "advisor", "partnerRepresentative" }, allowSetters = true)
    private Appointment appointments;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Anonymous id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getVisitDate() {
        return this.visitDate;
    }

    public Anonymous visitDate(Instant visitDate) {
        this.setVisitDate(visitDate);
        return this;
    }

    public void setVisitDate(Instant visitDate) {
        this.visitDate = visitDate;
    }

    public Person getPerson() {
        return this.person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Anonymous person(Person person) {
        this.setPerson(person);
        return this;
    }

    public Appointment getAppointments() {
        return this.appointments;
    }

    public void setAppointments(Appointment appointment) {
        this.appointments = appointment;
    }

    public Anonymous appointments(Appointment appointment) {
        this.setAppointments(appointment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Anonymous)) {
            return false;
        }
        return id != null && id.equals(((Anonymous) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Anonymous{" +
            "id=" + getId() +
            ", visitDate='" + getVisitDate() + "'" +
            "}";
    }
}
