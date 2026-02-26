package com.propulsion180.bandform_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.propulsion180.bandform_backend.data.User;
import com.propulsion180.bandform_backend.repositories.UserRepository;

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

	public User createUser(CreateUserInput input) {
		User user = new User();

	}
}
