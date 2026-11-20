package cl.duoc.petcare.service;

import cl.duoc.petcare.exception.RecursoNoEncontradoException;
import cl.duoc.petcare.exception.ReglaNegocioException;
import cl.duoc.petcare.model.Dueno;
import cl.duoc.petcare.model.Mascota;
import cl.duoc.petcare.repository.DuenoRepository;
import cl.duoc.petcare.repository.MascotaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DuenoService {

    private final DuenoRepository duenoRepository;
    private final MascotaRepository mascotaRepository;

    public DuenoService(DuenoRepository duenoRepository, MascotaRepository mascotaRepository) {
        this.duenoRepository = duenoRepository;
        this.mascotaRepository = mascotaRepository;
    }

    public List<Dueno> listar() {
        return duenoRepository.findAll();
    }

    public Dueno buscarPorId(Long id) {
        return duenoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe un dueño con id " + id));
    }

    @Transactional
    public Dueno crear(Dueno dueno) {
        dueno.setId(null);
        dueno.setRut(normalizarRut(dueno.getRut()));
        if (duenoRepository.existsByRut(dueno.getRut())) {
            throw new ReglaNegocioException("Ya existe un dueño con RUT " + dueno.getRut());
        }
        return duenoRepository.save(dueno);
    }

    @Transactional
    public Dueno actualizar(Long id, Dueno datos) {
        Dueno existente = buscarPorId(id);
        String rut = normalizarRut(datos.getRut());
        if (duenoRepository.existsByRutAndIdNot(rut, id)) {
            throw new ReglaNegocioException("Ya existe otro dueño con RUT " + rut);
        }
        existente.setRut(rut);
        existente.setNombre(datos.getNombre());
        existente.setTelefono(datos.getTelefono());
        existente.setEmail(datos.getEmail());
        return duenoRepository.save(existente);
    }

    @Transactional
    public void eliminar(Long id) {
        Dueno dueno = buscarPorId(id);
        duenoRepository.delete(dueno); // cascade: borra también sus mascotas y citas
    }

    /** Endpoint de relación: GET /api/duenos/{id}/mascotas */
    public List<Mascota> mascotasDelDueno(Long id) {
        buscarPorId(id); // valida que el dueño exista (si no, 404)
        return mascotaRepository.findByDuenoId(id);
    }

    /** Quita puntos y espacios y deja la K en mayúscula: "12.345.678-k" -> "12345678-K" */
    private String normalizarRut(String rut) {
        if (rut == null) return null;
        return rut.replace(".", "").replace(" ", "").toUpperCase();
    }
}
