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
 * A SmeRepresentative.
 */
@Entity
@Table(name = "sme_representative")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SmeRepresentative implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "is_admin")
    private Boolean isAdmin;

    @Column(name = "is_manager")
    private Boolean isManager;

    @OneToOne
    @JoinColumn(unique = true)
    private User internalUser;

    @JsonIgnoreProperties(value = { "language" }, allowSetters = true)
    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Person person;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(
        value = { "activityArea", "need", "smeHouse", "turnover", "experience", "size", "bank", "representatives", "files" },
        allowSetters = true
    )
    private Sme sme;

    @OneToMany(mappedBy = "smeRepresentative")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "smeRepresentative", "advisor", "partnerRepresentative" }, allowSetters = true)
    private Set<Appointment> appointments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SmeRepresentative id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public SmeRepresentative jobTitle(String jobTitle) {
        this.setJobTitle(jobTitle);
        return this;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Boolean getIsAdmin() {
        return this.isAdmin;
    }

    public SmeRepresentative isAdmin(Boolean isAdmin) {
        this.setIsAdmin(isAdmin);
        return this;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public Boolean getIsManager() {
        return this.isManager;
    }

    public SmeRepresentative isManager(Boolean isManager) {
        this.setIsManager(isManager);
        return this;
    }

    public void setIsManager(Boolean isManager) {
        this.isManager = isManager;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public SmeRepresentative internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Person getPerson() {
        return this.person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public SmeRepresentative person(Person person) {
        this.setPerson(person);
        return this;
    }

    public Sme getSme() {
        return this.sme;
    }

    public void setSme(Sme sme) {
        this.sme = sme;
    }

    public SmeRepresentative sme(Sme sme) {
        this.setSme(sme);
        return this;
    }

    public Set<Appointment> getAppointments() {
        return this.appointments;
    }

    public void setAppointments(Set<Appointment> appointments) {
        if (this.appointments != null) {
            this.appointments.forEach(i -> i.setSmeRepresentative(null));
        }
        if (appointments != null) {
            appointments.forEach(i -> i.setSmeRepresentative(this));
        }
        this.appointments = appointments;
    }

    public SmeRepresentative appointments(Set<Appointment> appointments) {
        this.setAppointments(appointments);
        return this;
    }

    public SmeRepresentative addAppointments(Appointment appointment) {
        this.appointments.add(appointment);
        appointment.setSmeRepresentative(this);
        return this;
    }

    public SmeRepresentative removeAppointments(Appointment appointment) {
        this.appointments.remove(appointment);
        appointment.setSmeRepresentative(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SmeRepresentative)) {
            return false;
        }
        return id != null && id.equals(((SmeRepresentative) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SmeRepresentative{" +
            "id=" + getId() +
            ", jobTitle='" + getJobTitle() + "'" +
            ", isAdmin='" + getIsAdmin() + "'" +
            ", isManager='" + getIsManager() + "'" +
            "}";
    }
}
