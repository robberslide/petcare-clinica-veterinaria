package cl.duoc.petcare.exception;

/** Se lanza cuando se busca algo por id y no existe -> HTTP 404. */
public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
