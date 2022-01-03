package com.baamtu.mdpme.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.DoubleFilter;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.FloatFilter;
import tech.jhipster.service.filter.IntegerFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.baamtu.mdpme.domain.Administrator} entity. This class is used
 * in {@link com.baamtu.mdpme.web.rest.AdministratorResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /administrators?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class AdministratorCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter jobTitle;

    private StringFilter description;

    private LongFilter internalUserId;

    private LongFilter personId;

    private LongFilter houseSmesId;

    private Boolean distinct;

    public AdministratorCriteria() {}

    public AdministratorCriteria(AdministratorCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.jobTitle = other.jobTitle == null ? null : other.jobTitle.copy();
        this.description = other.description == null ? null : other.description.copy();
        this.internalUserId = other.internalUserId == null ? null : other.internalUserId.copy();
        this.personId = other.personId == null ? null : other.personId.copy();
        this.houseSmesId = other.houseSmesId == null ? null : other.houseSmesId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public AdministratorCriteria copy() {
        return new AdministratorCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getJobTitle() {
        return jobTitle;
    }

    public StringFilter jobTitle() {
        if (jobTitle == null) {
            jobTitle = new StringFilter();
        }
        return jobTitle;
    }

    public void setJobTitle(StringFilter jobTitle) {
        this.jobTitle = jobTitle;
    }

    public StringFilter getDescription() {
        return description;
    }

    public StringFilter description() {
        if (description == null) {
            description = new StringFilter();
        }
        return description;
    }

    public void setDescription(StringFilter description) {
        this.description = description;
    }

    public LongFilter getInternalUserId() {
        return internalUserId;
    }

    public LongFilter internalUserId() {
        if (internalUserId == null) {
            internalUserId = new LongFilter();
        }
        return internalUserId;
    }

    public void setInternalUserId(LongFilter internalUserId) {
        this.internalUserId = internalUserId;
    }

    public LongFilter getPersonId() {
        return personId;
    }

    public LongFilter personId() {
        if (personId == null) {
            personId = new LongFilter();
        }
        return personId;
    }

    public void setPersonId(LongFilter personId) {
        this.personId = personId;
    }

    public LongFilter getHouseSmesId() {
        return houseSmesId;
    }

    public LongFilter houseSmesId() {
        if (houseSmesId == null) {
            houseSmesId = new LongFilter();
        }
        return houseSmesId;
    }

    public void setHouseSmesId(LongFilter houseSmesId) {
        this.houseSmesId = houseSmesId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final AdministratorCriteria that = (AdministratorCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(jobTitle, that.jobTitle) &&
            Objects.equals(description, that.description) &&
            Objects.equals(internalUserId, that.internalUserId) &&
            Objects.equals(personId, that.personId) &&
            Objects.equals(houseSmesId, that.houseSmesId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, jobTitle, description, internalUserId, personId, houseSmesId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdministratorCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (jobTitle != null ? "jobTitle=" + jobTitle + ", " : "") +
            (description != null ? "description=" + description + ", " : "") +
            (internalUserId != null ? "internalUserId=" + internalUserId + ", " : "") +
            (personId != null ? "personId=" + personId + ", " : "") +
            (houseSmesId != null ? "houseSmesId=" + houseSmesId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
