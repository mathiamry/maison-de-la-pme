package com.baamtu.mdpme.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A FrequentlyAskedQuestion.
 */
@Entity
@Table(name = "frequently_asked_question")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FrequentlyAskedQuestion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "question", nullable = false)
    private String question;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "answer", nullable = false)
    private String answer;

    @Column(name = "jhi_order")
    private Integer order;

    @Column(name = "is_published")
    private Boolean isPublished;

    @ManyToOne(optional = false)
    @NotNull
    private User author;

    @ManyToMany(mappedBy = "frequentlyAskedQuestions")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "country", "administrator", "frequentlyAskedQuestions", "advisors", "partners", "smes" },
        allowSetters = true
    )
    private Set<SMEHouse> smeHouses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FrequentlyAskedQuestion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return this.question;
    }

    public FrequentlyAskedQuestion question(String question) {
        this.setQuestion(question);
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return this.answer;
    }

    public FrequentlyAskedQuestion answer(String answer) {
        this.setAnswer(answer);
        return this;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Integer getOrder() {
        return this.order;
    }

    public FrequentlyAskedQuestion order(Integer order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Boolean getIsPublished() {
        return this.isPublished;
    }

    public FrequentlyAskedQuestion isPublished(Boolean isPublished) {
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

    public FrequentlyAskedQuestion author(User user) {
        this.setAuthor(user);
        return this;
    }

    public Set<SMEHouse> getSmeHouses() {
        return this.smeHouses;
    }

    public void setSmeHouses(Set<SMEHouse> sMEHouses) {
        if (this.smeHouses != null) {
            this.smeHouses.forEach(i -> i.removeFrequentlyAskedQuestions(this));
        }
        if (sMEHouses != null) {
            sMEHouses.forEach(i -> i.addFrequentlyAskedQuestions(this));
        }
        this.smeHouses = sMEHouses;
    }

    public FrequentlyAskedQuestion smeHouses(Set<SMEHouse> sMEHouses) {
        this.setSmeHouses(sMEHouses);
        return this;
    }

    public FrequentlyAskedQuestion addSmeHouses(SMEHouse sMEHouse) {
        this.smeHouses.add(sMEHouse);
        sMEHouse.getFrequentlyAskedQuestions().add(this);
        return this;
    }

    public FrequentlyAskedQuestion removeSmeHouses(SMEHouse sMEHouse) {
        this.smeHouses.remove(sMEHouse);
        sMEHouse.getFrequentlyAskedQuestions().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FrequentlyAskedQuestion)) {
            return false;
        }
        return id != null && id.equals(((FrequentlyAskedQuestion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FrequentlyAskedQuestion{" +
            "id=" + getId() +
            ", question='" + getQuestion() + "'" +
            ", answer='" + getAnswer() + "'" +
            ", order=" + getOrder() +
            ", isPublished='" + getIsPublished() + "'" +
            "}";
    }
}
