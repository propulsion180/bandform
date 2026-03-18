package xyz.wmmp.bandform_backend.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record Band(
        Integer id,
        @NotEmpty @NotBlank String name,
        List<String> bandGenres,
        List<User> bandMembers
) {}
