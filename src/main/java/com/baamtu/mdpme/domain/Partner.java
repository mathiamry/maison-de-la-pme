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
 * A Partner.
 */
@Entity
@Table(name = "partner")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Partner implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "address")
    private String address;

    @NotNull
    @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "logo")
    private String logo;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(
        value = { "country", "administrator", "frequentlyAskedQuestions", "advisors", "partners", "smes" },
        allowSetters = true
    )
    private SMEHouse smeHouse;

    @OneToMany(mappedBy = "partner")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "internalUser", "person", "partner", "appointmnents", "availabilityTimeslots", "unavailabilityPeriods" },
        allowSetters = true
    )
    private Set<PartnerRepresentative> representings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Partner id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Partner name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return this.address;
    }

    public Partner address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return this.email;
    }

    public Partner email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public Partner phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLogo() {
        return this.logo;
    }

    public Partner logo(String logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getLatitude() {
        return this.latitude;
    }

    public Partner latitude(String latitude) {
        this.setLatitude(latitude);
        return this;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return this.longitude;
    }

    public Partner longitude(String longitude) {
        this.setLongitude(longitude);
        return this;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public SMEHouse getSmeHouse() {
        return this.smeHouse;
    }

    public void setSmeHouse(SMEHouse sMEHouse) {
        this.smeHouse = sMEHouse;
    }

    public Partner smeHouse(SMEHouse sMEHouse) {
        this.setSmeHouse(sMEHouse);
        return this;
    }

    public Set<PartnerRepresentative> getRepresentings() {
        return this.representings;
    }

    public void setRepresentings(Set<PartnerRepresentative> partnerRepresentatives) {
        if (this.representings != null) {
            this.representings.forEach(i -> i.setPartner(null));
        }
        if (partnerRepresentatives != null) {
            partnerRepresentatives.forEach(i -> i.setPartner(this));
        }
        this.representings = partnerRepresentatives;
    }

    public Partner representings(Set<PartnerRepresentative> partnerRepresentatives) {
        this.setRepresentings(partnerRepresentatives);
        return this;
    }

    public Partner addRepresentings(PartnerRepresentative partnerRepresentative) {
        this.representings.add(partnerRepresentative);
        partnerRepresentative.setPartner(this);
        return this;
    }

    public Partner removeRepresentings(PartnerRepresentative partnerRepresentative) {
        this.representings.remove(partnerRepresentative);
        partnerRepresentative.setPartner(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Partner)) {
            return false;
        }
        return id != null && id.equals(((Partner) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Partner{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", address='" + getAddress() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", logo='" + getLogo() + "'" +
            ", latitude='" + getLatitude() + "'" +
            ", longitude='" + getLongitude() + "'" +
            "}";
    }
}
