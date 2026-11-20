package cl.duoc.petcare.service;

import cl.duoc.petcare.dto.CitaRequest;
import cl.duoc.petcare.exception.RecursoNoEncontradoException;
import cl.duoc.petcare.exception.ReglaNegocioException;
import cl.duoc.petcare.model.Cita;
import cl.duoc.petcare.model.Mascota;
import cl.duoc.petcare.repository.CitaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final MascotaService mascotaService;

    public CitaService(CitaRepository citaRepository, MascotaService mascotaService) {
        this.citaRepository = citaRepository;
        this.mascotaService = mascotaService;
    }

    public List<Cita> listar() {
        return citaRepository.findAll();
    }

    public Cita buscarPorId(Long id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe una cita con id " + id));
    }

    @Transactional
    public Cita crear(CitaRequest req) {
        // Validación pedida en el enunciado: no crear una cita para una mascota inexistente
        Mascota mascota = mascotaService.buscarPorId(req.mascotaId());
        validarFecha(req, mascota);
        Cita c = new Cita();
        copiarDatos(req, c, mascota);
        return citaRepository.save(c);
    }

    @Transactional
    public Cita actualizar(Long id, CitaRequest req) {
        Cita c = buscarPorId(id);
        Mascota mascota = mascotaService.buscarPorId(req.mascotaId());
        validarFecha(req, mascota);
        copiarDatos(req, c, mascota);
        return citaRepository.save(c);
    }

    @Transactional
    public void eliminar(Long id) {
        citaRepository.delete(buscarPorId(id));
    }

    /** La cita no puede ser anterior al nacimiento de la mascota. */
    private void validarFecha(CitaRequest req, Mascota mascota) {
        if (mascota.getFechaNacimiento() != null
                && req.fecha().toLocalDate().isBefore(mascota.getFechaNacimiento())) {
            throw new ReglaNegocioException("La fecha de la cita es anterior al nacimiento de la mascota");
        }
    }

    private void copiarDatos(CitaRequest req, Cita c, Mascota mascota) {
        c.setFecha(req.fecha());
        c.setMotivo(req.motivo());
        c.setDiagnostico(req.diagnostico());
        c.setCosto(req.costo());
        c.setMascota(mascota);
    }
}
