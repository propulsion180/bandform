package com.propulsion180.bandform_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.propulsion180.bandform_backend.data.User;
import com.propulsion180.bandform_backend.repositories.UserRepository;

import java.util.ArrayList;

import java.util.List;

@Service
public class UserService {
	private final UserRepository userRepository;

	@Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	public User getUserById(Long id) {
		return userRepository.findById(id).orElse(null);
	}

	public User createUser(String fName, String lName, String city, String country, String desc,
			ArrayList<String> instrucments) {
		User user = new User(fName, lName, city, country, desc, instrucments);
		return userRepository.save(user);

	}
}
