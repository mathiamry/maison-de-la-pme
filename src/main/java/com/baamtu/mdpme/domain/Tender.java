package com.baamtu.mdpme.domain;

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
 * A Tender.
 */
@Entity
@Table(name = "tender")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Tender implements Serializable {

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

    @Column(name = "publish_date")
    private Instant publishDate;

    @Column(name = "expiry_date")
    private Instant expiryDate;

    @Column(name = "is_valid")
    private Boolean isValid;

    @Column(name = "is_archived")
    private Boolean isArchived;

    @Column(name = "is_published")
    private Boolean isPublished;

    @ManyToOne(optional = false)
    @NotNull
    private User author;

    @OneToMany(mappedBy = "tender")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "tender", "sme" }, allowSetters = true)
    private Set<File> files = new HashSet<>();

    @OneToMany(mappedBy = "tender")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "event", "news", "tender" }, allowSetters = true)
    private Set<Notification> notifications = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Tender id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Tender title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Tender description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getPublishDate() {
        return this.publishDate;
    }

    public Tender publishDate(Instant publishDate) {
        this.setPublishDate(publishDate);
        return this;
    }

    public void setPublishDate(Instant publishDate) {
        this.publishDate = publishDate;
    }

    public Instant getExpiryDate() {
        return this.expiryDate;
    }

    public Tender expiryDate(Instant expiryDate) {
        this.setExpiryDate(expiryDate);
        return this;
    }

    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Boolean getIsValid() {
        return this.isValid;
    }

    public Tender isValid(Boolean isValid) {
        this.setIsValid(isValid);
        return this;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
    }

    public Boolean getIsArchived() {
        return this.isArchived;
    }

    public Tender isArchived(Boolean isArchived) {
        this.setIsArchived(isArchived);
        return this;
    }

    public void setIsArchived(Boolean isArchived) {
        this.isArchived = isArchived;
    }

    public Boolean getIsPublished() {
        return this.isPublished;
    }

    public Tender isPublished(Boolean isPublished) {
        this.setIsPublished(isPublished);
        return this;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public User getAuthor() {
        return this.author;
    }

    public void setAuthor(User user) {
        this.author = user;
    }

    public Tender author(User user) {
        this.setAuthor(user);
        return this;
    }

    public Set<File> getFiles() {
        return this.files;
    }

    public void setFiles(Set<File> files) {
        if (this.files != null) {
            this.files.forEach(i -> i.setTender(null));
        }
        if (files != null) {
            files.forEach(i -> i.setTender(this));
        }
        this.files = files;
    }

    public Tender files(Set<File> files) {
        this.setFiles(files);
        return this;
    }

    public Tender addFiles(File file) {
        this.files.add(file);
        file.setTender(this);
        return this;
    }

    public Tender removeFiles(File file) {
        this.files.remove(file);
        file.setTender(null);
        return this;
    }

    public Set<Notification> getNotifications() {
        return this.notifications;
    }

    public void setNotifications(Set<Notification> notifications) {
        if (this.notifications != null) {
            this.notifications.forEach(i -> i.setTender(null));
        }
        if (notifications != null) {
            notifications.forEach(i -> i.setTender(this));
        }
        this.notifications = notifications;
    }

    public Tender notifications(Set<Notification> notifications) {
        this.setNotifications(notifications);
        return this;
    }

    public Tender addNotification(Notification notification) {
        this.notifications.add(notification);
        notification.setTender(this);
        return this;
    }

    public Tender removeNotification(Notification notification) {
        this.notifications.remove(notification);
        notification.setTender(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tender)) {
            return false;
        }
        return id != null && id.equals(((Tender) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tender{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", publishDate='" + getPublishDate() + "'" +
            ", expiryDate='" + getExpiryDate() + "'" +
            ", isValid='" + getIsValid() + "'" +
            ", isArchived='" + getIsArchived() + "'" +
            ", isPublished='" + getIsPublished() + "'" +
            "}";
    }
}
