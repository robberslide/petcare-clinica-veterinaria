package cl.duoc.petcare.controller;

import cl.duoc.petcare.model.Dueno;
import cl.duoc.petcare.model.Mascota;
import cl.duoc.petcare.service.DuenoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/duenos")
@CrossOrigin(origins = "*") // permite que el frontend React consuma la API
public class DuenoController {

    private final DuenoService service;

    public DuenoController(DuenoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Dueno> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Dueno obtener(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Dueno> crear(@Valid @RequestBody Dueno dueno) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dueno));
    }

    @PutMapping("/{id}")
    public Dueno actualizar(@PathVariable Long id, @Valid @RequestBody Dueno dueno) {
        return service.actualizar(id, dueno);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint de relación
    @GetMapping("/{id}/mascotas")
    public List<Mascota> mascotas(@PathVariable Long id) {
        return service.mascotasDelDueno(id);
    }
}
