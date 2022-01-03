package com.baamtu.mdpme.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.baamtu.mdpme.domain.Administrator} entity.
 */
public class AdministratorDTO implements Serializable {

    private Long id;

    private String jobTitle;

    private String description;

    private UserDTO internalUser;

    private PersonDTO person;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserDTO getInternalUser() {
        return internalUser;
    }

    public void setInternalUser(UserDTO internalUser) {
        this.internalUser = internalUser;
    }

    public PersonDTO getPerson() {
        return person;
    }

    public void setPerson(PersonDTO person) {
        this.person = person;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdministratorDTO)) {
            return false;
        }

        AdministratorDTO administratorDTO = (AdministratorDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, administratorDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdministratorDTO{" +
            "id=" + getId() +
            ", jobTitle='" + getJobTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", internalUser=" + getInternalUser() +
            ", person=" + getPerson() +
            "}";
    }
}
