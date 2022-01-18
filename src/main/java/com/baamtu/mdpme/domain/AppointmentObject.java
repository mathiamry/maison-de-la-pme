package com.baamtu.mdpme.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AppointmentObject.
 */
@Entity
@Table(name = "appointment_object")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AppointmentObject implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "object", nullable = false)
    private String object;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "smeRepresentative", "advisor", "partnerRepresentative", "appointments" }, allowSetters = true)
    private Appointment object;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AppointmentObject id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getObject() {
        return this.object;
    }

    public AppointmentObject object(String object) {
        this.setObject(object);
        return this;
    }

    public void setObject(String object) {
        this.object = object;
    }

    public Appointment getObject() {
        return this.object;
    }

    public void setObject(Appointment appointment) {
        this.object = appointment;
    }

    public AppointmentObject object(Appointment appointment) {
        this.setObject(appointment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppointmentObject)) {
            return false;
        }
        return id != null && id.equals(((AppointmentObject) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppointmentObject{" +
            "id=" + getId() +
            ", object='" + getObject() + "'" +
            "}";
    }
}
