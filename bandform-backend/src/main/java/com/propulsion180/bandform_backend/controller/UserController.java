package com.propulsion180.bandform_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.propulsion180.bandform_backend.services.UserService;
import com.propulsion180.bandform_backend.data.User;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
	private final UserService userService;

	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}

	@GetMapping("/{id}")
	public User getUser(@PathVariable Long id) {
		return userService.getUserById(id);
	}

	@PostMapping
	public User createUser(@RequestParam String fName, @RequestParam String lName, @RequestParam String city,
			@RequestParam String country, @RequestParam String desc, @RequestParam ArrayList<String> inst) {
		return userService.createUser(fName, lName, city, country, desc, inst);
	}
}
