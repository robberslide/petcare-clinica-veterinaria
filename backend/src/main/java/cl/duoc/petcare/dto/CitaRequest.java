package cl.duoc.petcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

/** Lo que el cliente envía para crear/editar una cita (con el id de la mascota). */
public record CitaRequest(
        @NotNull(message = "La fecha es obligatoria") LocalDateTime fecha,
        @NotBlank(message = "El motivo es obligatorio") String motivo,
        String diagnostico,
        @NotNull(message = "El costo es obligatorio")
        @PositiveOrZero(message = "El costo no puede ser negativo") Integer costo,
        @NotNull(message = "El mascotaId es obligatorio") Long mascotaId
) {}
