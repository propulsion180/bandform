package xyz.wmmp.bandform_backend.data;

import java.util.List;

public record User(Integer id, String name, String city, String country, String description, List<String> instruments) {
}
