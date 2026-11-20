package cl.duoc.petcare.service;

import cl.duoc.petcare.dto.MascotaRequest;
import cl.duoc.petcare.exception.RecursoNoEncontradoException;
import cl.duoc.petcare.model.Cita;
import cl.duoc.petcare.model.Dueno;
import cl.duoc.petcare.model.Mascota;
import cl.duoc.petcare.repository.CitaRepository;
import cl.duoc.petcare.repository.MascotaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MascotaService {

    private final MascotaRepository mascotaRepository;
    private final CitaRepository citaRepository;
    private final DuenoService duenoService;

    public MascotaService(MascotaRepository mascotaRepository, CitaRepository citaRepository,
                          DuenoService duenoService) {
        this.mascotaRepository = mascotaRepository;
        this.citaRepository = citaRepository;
        this.duenoService = duenoService;
    }

    public List<Mascota> listar() {
        return mascotaRepository.findAll();
    }

    public Mascota buscarPorId(Long id) {
        return mascotaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe una mascota con id " + id));
    }

    @Transactional
    public Mascota crear(MascotaRequest req) {
        // Validación: no se puede crear una mascota para un dueño que no existe
        Dueno dueno = duenoService.buscarPorId(req.duenoId());
        Mascota m = new Mascota();
        copiarDatos(req, m, dueno);
        return mascotaRepository.save(m);
    }

    @Transactional
    public Mascota actualizar(Long id, MascotaRequest req) {
        Mascota m = buscarPorId(id);
        Dueno dueno = duenoService.buscarPorId(req.duenoId());
        copiarDatos(req, m, dueno);
        return mascotaRepository.save(m);
    }

    @Transactional
    public void eliminar(Long id) {
        Mascota m = buscarPorId(id);
        mascotaRepository.delete(m); // cascade: borra también sus citas
    }

    /** Endpoint de relación: GET /api/mascotas/{id}/citas */
    public List<Cita> citasDeLaMascota(Long id) {
        buscarPorId(id); // 404 si la mascota no existe
        return citaRepository.findByMascotaIdOrderByFechaDesc(id);
    }

    private void copiarDatos(MascotaRequest req, Mascota m, Dueno dueno) {
        m.setNombre(req.nombre());
        m.setEspecie(req.especie());
        m.setRaza(req.raza());
        m.setFechaNacimiento(req.fechaNacimiento());
        m.setDueno(dueno);
    }
}
