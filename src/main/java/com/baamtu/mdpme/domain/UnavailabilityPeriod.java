package com.baamtu.mdpme.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UnavailabilityPeriod.
 */
@Entity
@Table(name = "unavailability_period")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UnavailabilityPeriod implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @ManyToMany
    @JoinTable(
        name = "rel_unavailability_period__advisor",
        joinColumns = @JoinColumn(name = "unavailability_period_id"),
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
        name = "rel_unavailability_period__partner_representative",
        joinColumns = @JoinColumn(name = "unavailability_period_id"),
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

    public UnavailabilityPeriod id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public UnavailabilityPeriod startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public UnavailabilityPeriod endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Set<Advisor> getAdvisors() {
        return this.advisors;
    }

    public void setAdvisors(Set<Advisor> advisors) {
        this.advisors = advisors;
    }

    public UnavailabilityPeriod advisors(Set<Advisor> advisors) {
        this.setAdvisors(advisors);
        return this;
    }

    public UnavailabilityPeriod addAdvisor(Advisor advisor) {
        this.advisors.add(advisor);
        advisor.getUnavailabilityPeriods().add(this);
        return this;
    }

    public UnavailabilityPeriod removeAdvisor(Advisor advisor) {
        this.advisors.remove(advisor);
        advisor.getUnavailabilityPeriods().remove(this);
        return this;
    }

    public Set<PartnerRepresentative> getPartnerRepresentatives() {
        return this.partnerRepresentatives;
    }

    public void setPartnerRepresentatives(Set<PartnerRepresentative> partnerRepresentatives) {
        this.partnerRepresentatives = partnerRepresentatives;
    }

    public UnavailabilityPeriod partnerRepresentatives(Set<PartnerRepresentative> partnerRepresentatives) {
        this.setPartnerRepresentatives(partnerRepresentatives);
        return this;
    }

    public UnavailabilityPeriod addPartnerRepresentative(PartnerRepresentative partnerRepresentative) {
        this.partnerRepresentatives.add(partnerRepresentative);
        partnerRepresentative.getUnavailabilityPeriods().add(this);
        return this;
    }

    public UnavailabilityPeriod removePartnerRepresentative(PartnerRepresentative partnerRepresentative) {
        this.partnerRepresentatives.remove(partnerRepresentative);
        partnerRepresentative.getUnavailabilityPeriods().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UnavailabilityPeriod)) {
            return false;
        }
        return id != null && id.equals(((UnavailabilityPeriod) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UnavailabilityPeriod{" +
            "id=" + getId() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
