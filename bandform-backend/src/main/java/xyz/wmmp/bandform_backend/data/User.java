package xyz.wmmp.bandform_backend.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record User(Integer id,
                   @NotEmpty @NotBlank String name,
                   @NotEmpty @NotBlank String city,
                   @NotEmpty @NotBlank String country,
                   @NotEmpty String description,
                   List<String> instruments) {}
