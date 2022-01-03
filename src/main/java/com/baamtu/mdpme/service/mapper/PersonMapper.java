package com.baamtu.mdpme.service.mapper;

import com.baamtu.mdpme.domain.Person;
import com.baamtu.mdpme.service.dto.PersonDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Person} and its DTO {@link PersonDTO}.
 */
@Mapper(componentModel = "spring", uses = { LanguageMapper.class })
public interface PersonMapper extends EntityMapper<PersonDTO, Person> {
    @Mapping(target = "language", source = "language", qualifiedByName = "id")
    PersonDTO toDto(Person s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PersonDTO toDtoId(Person person);
}
