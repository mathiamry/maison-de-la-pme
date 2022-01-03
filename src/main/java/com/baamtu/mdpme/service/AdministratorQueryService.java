package com.baamtu.mdpme.service;

import com.baamtu.mdpme.domain.*; // for static metamodels
import com.baamtu.mdpme.domain.Administrator;
import com.baamtu.mdpme.repository.AdministratorRepository;
import com.baamtu.mdpme.service.criteria.AdministratorCriteria;
import com.baamtu.mdpme.service.dto.AdministratorDTO;
import com.baamtu.mdpme.service.mapper.AdministratorMapper;
import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Administrator} entities in the database.
 * The main input is a {@link AdministratorCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link AdministratorDTO} or a {@link Page} of {@link AdministratorDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class AdministratorQueryService extends QueryService<Administrator> {

    private final Logger log = LoggerFactory.getLogger(AdministratorQueryService.class);

    private final AdministratorRepository administratorRepository;

    private final AdministratorMapper administratorMapper;

    public AdministratorQueryService(AdministratorRepository administratorRepository, AdministratorMapper administratorMapper) {
        this.administratorRepository = administratorRepository;
        this.administratorMapper = administratorMapper;
    }

    /**
     * Return a {@link List} of {@link AdministratorDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<AdministratorDTO> findByCriteria(AdministratorCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Administrator> specification = createSpecification(criteria);
        return administratorMapper.toDto(administratorRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link AdministratorDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<AdministratorDTO> findByCriteria(AdministratorCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Administrator> specification = createSpecification(criteria);
        return administratorRepository.findAll(specification, page).map(administratorMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(AdministratorCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Administrator> specification = createSpecification(criteria);
        return administratorRepository.count(specification);
    }

    /**
     * Function to convert {@link AdministratorCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Administrator> createSpecification(AdministratorCriteria criteria) {
        Specification<Administrator> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Administrator_.id));
            }
            if (criteria.getJobTitle() != null) {
                specification = specification.and(buildStringSpecification(criteria.getJobTitle(), Administrator_.jobTitle));
            }
            if (criteria.getDescription() != null) {
                specification = specification.and(buildStringSpecification(criteria.getDescription(), Administrator_.description));
            }
            if (criteria.getInternalUserId() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getInternalUserId(),
                            root -> root.join(Administrator_.internalUser, JoinType.LEFT).get(User_.id)
                        )
                    );
            }
            if (criteria.getPersonId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getPersonId(), root -> root.join(Administrator_.person, JoinType.LEFT).get(Person_.id))
                    );
            }
            if (criteria.getHouseSmesId() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getHouseSmesId(),
                            root -> root.join(Administrator_.houseSmes, JoinType.LEFT).get(SMEHouse_.id)
                        )
                    );
            }
        }
        return specification;
    }
}
