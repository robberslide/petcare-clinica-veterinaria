package cl.duoc.petcare.repository;

import cl.duoc.petcare.model.Dueno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DuenoRepository extends JpaRepository<Dueno, Long> {
    boolean existsByRut(String rut);
    boolean existsByRutAndIdNot(String rut, Long id);
}
