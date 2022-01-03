package com.baamtu.mdpme.service.mapper;

import com.baamtu.mdpme.domain.Administrator;
import com.baamtu.mdpme.service.dto.AdministratorDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Administrator} and its DTO {@link AdministratorDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class, PersonMapper.class })
public interface AdministratorMapper extends EntityMapper<AdministratorDTO, Administrator> {
    @Mapping(target = "internalUser", source = "internalUser", qualifiedByName = "id")
    @Mapping(target = "person", source = "person", qualifiedByName = "id")
    AdministratorDTO toDto(Administrator s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AdministratorDTO toDtoId(Administrator administrator);
}
