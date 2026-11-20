package cl.duoc.petcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;

/** Lo que el cliente envía para crear/editar una mascota (con el id del dueño). */
public record MascotaRequest(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotBlank(message = "La especie es obligatoria") String especie,
        String raza,
        @PastOrPresent(message = "La fecha de nacimiento no puede ser futura") LocalDate fechaNacimiento,
        @NotNull(message = "El duenoId es obligatorio") Long duenoId
) {}
