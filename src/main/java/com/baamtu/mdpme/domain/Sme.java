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
 * A Sme.
 */
@Entity
@Table(name = "sme")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Sme implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "phone_2")
    private String phone2;

    @Column(name = "logo")
    private String logo;

    @Column(name = "address")
    private String address;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    @Column(name = "web_site")
    private String webSite;

    @NotNull
    @Column(name = "sme_immatriculation_number", nullable = false)
    private String smeImmatriculationNumber;

    @Column(name = "is_client")
    private Boolean isClient;

    @Column(name = "is_authorized")
    private Boolean isAuthorized;

    @Column(name = "terms_of_use")
    private String termsOfUse;

    @Column(name = "is_valid")
    private Boolean isValid;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "smes" }, allowSetters = true)
    private ActivityArea activityArea;

    @ManyToOne
    @JsonIgnoreProperties(value = { "smes" }, allowSetters = true)
    private Need need;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "country", "administrator", "advisors", "partners", "smes" }, allowSetters = true)
    private SMEHouse smeHouse;

    @ManyToOne
    @JsonIgnoreProperties(value = { "smes" }, allowSetters = true)
    private Turnover turnover;

    @ManyToOne
    @JsonIgnoreProperties(value = { "smes" }, allowSetters = true)
    private Experience experience;

    @ManyToOne
    @JsonIgnoreProperties(value = { "smes" }, allowSetters = true)
    private Size size;

    @OneToMany(mappedBy = "sme")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "internalUser", "person", "sme", "appointments" }, allowSetters = true)
    private Set<SmeRepresentative> representatives = new HashSet<>();

    @OneToMany(mappedBy = "sme")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "tender", "sme" }, allowSetters = true)
    private Set<File> files = new HashSet<>();

    @ManyToMany(mappedBy = "smes")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "smes" }, allowSetters = true)
    private Set<Bank> banks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sme id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Sme name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public Sme email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public Sme phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhone2() {
        return this.phone2;
    }

    public Sme phone2(String phone2) {
        this.setPhone2(phone2);
        return this;
    }

    public void setPhone2(String phone2) {
        this.phone2 = phone2;
    }

    public String getLogo() {
        return this.logo;
    }

    public Sme logo(String logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getAddress() {
        return this.address;
    }

    public Sme address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLatitude() {
        return this.latitude;
    }

    public Sme latitude(String latitude) {
        this.setLatitude(latitude);
        return this;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return this.longitude;
    }

    public Sme longitude(String longitude) {
        this.setLongitude(longitude);
        return this;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getWebSite() {
        return this.webSite;
    }

    public Sme webSite(String webSite) {
        this.setWebSite(webSite);
        return this;
    }

    public void setWebSite(String webSite) {
        this.webSite = webSite;
    }

    public String getSmeImmatriculationNumber() {
        return this.smeImmatriculationNumber;
    }

    public Sme smeImmatriculationNumber(String smeImmatriculationNumber) {
        this.setSmeImmatriculationNumber(smeImmatriculationNumber);
        return this;
    }

    public void setSmeImmatriculationNumber(String smeImmatriculationNumber) {
        this.smeImmatriculationNumber = smeImmatriculationNumber;
    }

    public Boolean getIsClient() {
        return this.isClient;
    }

    public Sme isClient(Boolean isClient) {
        this.setIsClient(isClient);
        return this;
    }

    public void setIsClient(Boolean isClient) {
        this.isClient = isClient;
    }

    public Boolean getIsAuthorized() {
        return this.isAuthorized;
    }

    public Sme isAuthorized(Boolean isAuthorized) {
        this.setIsAuthorized(isAuthorized);
        return this;
    }

    public void setIsAuthorized(Boolean isAuthorized) {
        this.isAuthorized = isAuthorized;
    }

    public String getTermsOfUse() {
        return this.termsOfUse;
    }

    public Sme termsOfUse(String termsOfUse) {
        this.setTermsOfUse(termsOfUse);
        return this;
    }

    public void setTermsOfUse(String termsOfUse) {
        this.termsOfUse = termsOfUse;
    }

    public Boolean getIsValid() {
        return this.isValid;
    }

    public Sme isValid(Boolean isValid) {
        this.setIsValid(isValid);
        return this;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
    }

    public ActivityArea getActivityArea() {
        return this.activityArea;
    }

    public void setActivityArea(ActivityArea activityArea) {
        this.activityArea = activityArea;
    }

    public Sme activityArea(ActivityArea activityArea) {
        this.setActivityArea(activityArea);
        return this;
    }

    public Need getNeed() {
        return this.need;
    }

    public void setNeed(Need need) {
        this.need = need;
    }

    public Sme need(Need need) {
        this.setNeed(need);
        return this;
    }

    public SMEHouse getSmeHouse() {
        return this.smeHouse;
    }

    public void setSmeHouse(SMEHouse sMEHouse) {
        this.smeHouse = sMEHouse;
    }

    public Sme smeHouse(SMEHouse sMEHouse) {
        this.setSmeHouse(sMEHouse);
        return this;
    }

    public Turnover getTurnover() {
        return this.turnover;
    }

    public void setTurnover(Turnover turnover) {
        this.turnover = turnover;
    }

    public Sme turnover(Turnover turnover) {
        this.setTurnover(turnover);
        return this;
    }

    public Experience getExperience() {
        return this.experience;
    }

    public void setExperience(Experience experience) {
        this.experience = experience;
    }

    public Sme experience(Experience experience) {
        this.setExperience(experience);
        return this;
    }

    public Size getSize() {
        return this.size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public Sme size(Size size) {
        this.setSize(size);
        return this;
    }

    public Set<SmeRepresentative> getRepresentatives() {
        return this.representatives;
    }

    public void setRepresentatives(Set<SmeRepresentative> smeRepresentatives) {
        if (this.representatives != null) {
            this.representatives.forEach(i -> i.setSme(null));
        }
        if (smeRepresentatives != null) {
            smeRepresentatives.forEach(i -> i.setSme(this));
        }
        this.representatives = smeRepresentatives;
    }

    public Sme representatives(Set<SmeRepresentative> smeRepresentatives) {
        this.setRepresentatives(smeRepresentatives);
        return this;
    }

    public Sme addRepresentatives(SmeRepresentative smeRepresentative) {
        this.representatives.add(smeRepresentative);
        smeRepresentative.setSme(this);
        return this;
    }

    public Sme removeRepresentatives(SmeRepresentative smeRepresentative) {
        this.representatives.remove(smeRepresentative);
        smeRepresentative.setSme(null);
        return this;
    }

    public Set<File> getFiles() {
        return this.files;
    }

    public void setFiles(Set<File> files) {
        if (this.files != null) {
            this.files.forEach(i -> i.setSme(null));
        }
        if (files != null) {
            files.forEach(i -> i.setSme(this));
        }
        this.files = files;
    }

    public Sme files(Set<File> files) {
        this.setFiles(files);
        return this;
    }

    public Sme addFiles(File file) {
        this.files.add(file);
        file.setSme(this);
        return this;
    }

    public Sme removeFiles(File file) {
        this.files.remove(file);
        file.setSme(null);
        return this;
    }

    public Set<Bank> getBanks() {
        return this.banks;
    }

    public void setBanks(Set<Bank> banks) {
        if (this.banks != null) {
            this.banks.forEach(i -> i.removeSme(this));
        }
        if (banks != null) {
            banks.forEach(i -> i.addSme(this));
        }
        this.banks = banks;
    }

    public Sme banks(Set<Bank> banks) {
        this.setBanks(banks);
        return this;
    }

    public Sme addBanks(Bank bank) {
        this.banks.add(bank);
        bank.getSmes().add(this);
        return this;
    }

    public Sme removeBanks(Bank bank) {
        this.banks.remove(bank);
        bank.getSmes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sme)) {
            return false;
        }
        return id != null && id.equals(((Sme) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sme{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", phone2='" + getPhone2() + "'" +
            ", logo='" + getLogo() + "'" +
            ", address='" + getAddress() + "'" +
            ", latitude='" + getLatitude() + "'" +
            ", longitude='" + getLongitude() + "'" +
            ", webSite='" + getWebSite() + "'" +
            ", smeImmatriculationNumber='" + getSmeImmatriculationNumber() + "'" +
            ", isClient='" + getIsClient() + "'" +
            ", isAuthorized='" + getIsAuthorized() + "'" +
            ", termsOfUse='" + getTermsOfUse() + "'" +
            ", isValid='" + getIsValid() + "'" +
            "}";
    }
}
