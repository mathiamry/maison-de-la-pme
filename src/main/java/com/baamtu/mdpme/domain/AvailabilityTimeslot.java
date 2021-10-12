package com.baamtu.mdpme.domain;

import com.baamtu.mdpme.domain.enumeration.Day;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AvailabilityTimeslot.
 */
@Entity
@Table(name = "availability_timeslot")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AvailabilityTimeslot implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "start_hour", nullable = false)
    private Integer startHour;

    @NotNull
    @Column(name = "start_min", nullable = false)
    private Integer startMin;

    @NotNull
    @Column(name = "end_hour", nullable = false)
    private Integer endHour;

    @NotNull
    @Column(name = "end_min", nullable = false)
    private Integer endMin;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "day", nullable = false)
    private Day day;

    @ManyToMany
    @JoinTable(
        name = "rel_availability_timeslot__advisor",
        joinColumns = @JoinColumn(name = "availability_timeslot_id"),
        inverseJoinColumns = @JoinColumn(name = "advisor_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "internalUser", "person", "smeHouse", "appointmnents", "availabilityTimeslots", "unavailabilityPeriods" },
        allowSetters = true
    )
    private Set<Advisor> advisors = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_availability_timeslot__partner_representative",
        joinColumns = @JoinColumn(name = "availability_timeslot_id"),
        inverseJoinColumns = @JoinColumn(name = "partner_representative_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "internalUser", "person", "partner", "appointmnents", "availabilityTimeslots", "unavailabilityPeriods" },
        allowSetters = true
    )
    private Set<PartnerRepresentative> partnerRepresentatives = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AvailabilityTimeslot id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStartHour() {
        return this.startHour;
    }

    public AvailabilityTimeslot startHour(Integer startHour) {
        this.setStartHour(startHour);
        return this;
    }

    public void setStartHour(Integer startHour) {
        this.startHour = startHour;
    }

    public Integer getStartMin() {
        return this.startMin;
    }

    public AvailabilityTimeslot startMin(Integer startMin) {
        this.setStartMin(startMin);
        return this;
    }

    public void setStartMin(Integer startMin) {
        this.startMin = startMin;
    }

    public Integer getEndHour() {
        return this.endHour;
    }

    public AvailabilityTimeslot endHour(Integer endHour) {
        this.setEndHour(endHour);
        return this;
    }

    public void setEndHour(Integer endHour) {
        this.endHour = endHour;
    }

    public Integer getEndMin() {
        return this.endMin;
    }

    public AvailabilityTimeslot endMin(Integer endMin) {
        this.setEndMin(endMin);
        return this;
    }

    public void setEndMin(Integer endMin) {
        this.endMin = endMin;
    }

    public Day getDay() {
        return this.day;
    }

    public AvailabilityTimeslot day(Day day) {
        this.setDay(day);
        return this;
    }

    public void setDay(Day day) {
        this.day = day;
    }

    public Set<Advisor> getAdvisors() {
        return this.advisors;
    }

    public void setAdvisors(Set<Advisor> advisors) {
        this.advisors = advisors;
    }

    public AvailabilityTimeslot advisors(Set<Advisor> advisors) {
        this.setAdvisors(advisors);
        return this;
    }

    public AvailabilityTimeslot addAdvisor(Advisor advisor) {
        this.advisors.add(advisor);
        advisor.getAvailabilityTimeslots().add(this);
        return this;
    }

    public AvailabilityTimeslot removeAdvisor(Advisor advisor) {
        this.advisors.remove(advisor);
        advisor.getAvailabilityTimeslots().remove(this);
        return this;
    }

    public Set<PartnerRepresentative> getPartnerRepresentatives() {
        return this.partnerRepresentatives;
    }

    public void setPartnerRepresentatives(Set<PartnerRepresentative> partnerRepresentatives) {
        this.partnerRepresentatives = partnerRepresentatives;
    }

    public AvailabilityTimeslot partnerRepresentatives(Set<PartnerRepresentative> partnerRepresentatives) {
        this.setPartnerRepresentatives(partnerRepresentatives);
        return this;
    }

    public AvailabilityTimeslot addPartnerRepresentative(PartnerRepresentative partnerRepresentative) {
        this.partnerRepresentatives.add(partnerRepresentative);
        partnerRepresentative.getAvailabilityTimeslots().add(this);
        return this;
    }

    public AvailabilityTimeslot removePartnerRepresentative(PartnerRepresentative partnerRepresentative) {
        this.partnerRepresentatives.remove(partnerRepresentative);
        partnerRepresentative.getAvailabilityTimeslots().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AvailabilityTimeslot)) {
            return false;
        }
        return id != null && id.equals(((AvailabilityTimeslot) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AvailabilityTimeslot{" +
            "id=" + getId() +
            ", startHour=" + getStartHour() +
            ", startMin=" + getStartMin() +
            ", endHour=" + getEndHour() +
            ", endMin=" + getEndMin() +
            ", day='" + getDay() + "'" +
            "}";
    }
}
