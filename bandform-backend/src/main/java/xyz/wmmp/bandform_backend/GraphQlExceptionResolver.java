package xyz.wmmp.bandform_backend;

import java.util.stream.Collectors;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import jakarta.validation.ConstraintViolationException;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.graphql.execution.ErrorType;
import org.springframework.stereotype.Component;

/**
 * Turns validation-type failures into a GraphQL BAD_REQUEST error that carries a
 * human-readable message, so the client sees the real reason (e.g. "Invalid
 * Email Address!", the password rule, or an entity @Size violation) instead of
 * the generic INTERNAL_ERROR that unhandled exceptions surface as. Anything not
 * matched here falls through to Spring's default handling (still logged by
 * GlobalExceptionHandler) and stays a generic error, so we don't leak internals.
 */
@Component
public class GraphQlExceptionResolver extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        // Entity @Size/@NotBlank violations are raised by Hibernate at transaction
        // flush, so by the time they surface here they're wrapped (e.g. in a
        // TransactionSystemException). Walk the cause chain to find the real one.
        ConstraintViolationException cve = findCause(ex, ConstraintViolationException.class);
        if (cve != null) {
            return badRequest(env, formatViolations(cve));
        }
        if (ex instanceof IllegalArgumentException) {
            return badRequest(env, ex.getMessage());
        }
        return null;
    }

    private static <T extends Throwable> T findCause(Throwable ex, Class<T> type) {
        Throwable current = ex;
        while (current != null) {
            if (type.isInstance(current)) {
                return type.cast(current);
            }
            current = current.getCause();
        }
        return null;
    }

    private GraphQLError badRequest(DataFetchingEnvironment env, String message) {
        return GraphqlErrorBuilder.newError(env)
                .errorType(ErrorType.BAD_REQUEST)
                .message(message)
                .build();
    }

    private String formatViolations(ConstraintViolationException cve) {
        if (cve.getConstraintViolations() == null || cve.getConstraintViolations().isEmpty()) {
            return "Invalid input.";
        }
        return cve.getConstraintViolations().stream()
                .map(v -> {
                    String field = v.getPropertyPath() == null ? "" : v.getPropertyPath().toString();
                    return field.isEmpty() ? v.getMessage() : field + " " + v.getMessage();
                })
                .distinct()
                .collect(Collectors.joining("; "));
    }
}
