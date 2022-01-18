package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.AppointmentObject;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AppointmentObject entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppointmentObjectRepository extends JpaRepository<AppointmentObject, Long> {}
